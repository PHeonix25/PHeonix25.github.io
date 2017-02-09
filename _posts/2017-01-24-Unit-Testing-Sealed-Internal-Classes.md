---
layout: post
title: "Unit Testing Sealed Internal Classes"
date: 2017-01-24 00:00:00 +0000
categories: unit-testing
published: true
image: /assets/headers/2017-01-24-Unit-Testing-Sealed-Internal-Classes.png
---

As I wrote in my last post, I'm a big fan of clean, clear, simple unit-tests. Part of this involves figuring out where your "boundary" is and clarifying the limits of the code that you're responsible for. Normally this is simple and straightforward, but ~sometimes~most of the time, trying to test a class with an unnecessary access modifier and limited construction options is going to end in frustration.
<!--description-->
![2017-01-24-Unit-Testing-Sealed-Internal-Classes](/assets/headers/2017-01-24-Unit-Testing-Sealed-Internal-Classes.png)

So, as I showed you [in my last post][last-post], we were writing a nice small, simple application, but it had a requirement to grab some files via SFTP. Easy, we thought, we'll just grab [WinSCP][winscp] and use that because it has a nice interface and a decent NuGet package. It's pretty easy to use and has been around for ages, so it should be nice and stable. 

By now, you may notice that one of my usual criteria is missing from that last sentence - we didn't check how easy it would be to test! As a direct result, I'm here to talk about how horrible it is to test a library (or assembly) that uses `static`/`sealed` classes in conjunction with `private`/`protected`/`internal` constructors.

## Isn't testing WinSCP outside the "boundary"?

**Yes!** - it shouldn't be a concern of mine what happens when I call a function within the WinSCP assembly. So normally we'd write a wrapper over the required functionality (using some form of the [Factory][factory] or [Adapter][adapter] pattern) and develop, *and test*, using the wrapper.

Unfortunately, because the classes are marked as `sealed`, we can't inherit from it, and because the constructors are all marked as `internal`, we can't create new instances of the required classes. This makes it nearly impossible to abstract away using our normal techniques and tools like [AutoFixture][autofixture] and [Moq][moq].

## Easier with an example

So far, that's a lot of words, so maybe this'll make a bit more sense with some real code that demonstrates our problem:

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        private IFixture _fixture;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }

        [TestMethod]
        public void Download_WithFailingSessionProvider_ShouldLogExceptionFromSessionOpen()
        {
            var exception = _fixture.Create<SessionException>();
            _sessionProvider.Setup(sp => sp.Open(It.IsAny<SessionOptions>()))
                            .Throws(exception);
            // Act
            // Assert
        }
    }
}
```

The above unit test fails on the **first line** with the following error message:

> `Ploeh.AutoFixture.ObjectCreationException: `
> `AutoFixture was unable to create an instance from WinSCP.SessionException,`
> `most likely because it has no public constructor, is an abstract or non-public type.`

_"OK OK OK"_, I hear you say, _"but these are *exceptions* - you're not supposed to build on top of exceptions generated from an external library"_, and again, you'd be right, so how about a test that checks that we get some files back assuming the connection can be opened and the remote operation is successful?

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        private IFixture _fixture;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }
        
        [TestMethod]
        public void Download_WithSuccessfulTransferResult_ShouldReturnTransfers()
        {
            var transferResult = _fixture.Create<TransferOperationResult>();
            _sessionProvider.Setup(sp =>
                                sp.GetFiles(It.IsAny<string>(),
                                    It.IsAny<string>(),
                                    false,
                                    It.IsAny<TransferOptions>()))
                            .Returns(transferResult);
            // Act
            // Assert
        }
    }
}
```

Nope, same problem, we can't create an instance of the return object type either.

> `Ploeh.AutoFixture.ObjectCreationException: `
> `AutoFixture was unable to create an instance from WinSCP.TransferOperationResult,`
> `most likely because it has no public constructor, is an abstract or non-public type.`

Before we go much further, it's probably worth clarifying, that if we start to inspect this library, there are _very few_ interfaces, most classes are `sealed` and the public "surface" is quite limited:

```cs
namespace WinSCP_decompiled
{
	[ClassInterface(ClassInterfaceType.AutoDispatch), ComVisible(true)]
	public sealed class TransferOperationResult : OperationResultBase
	{
		public TransferEventArgsCollection Transfers
		{
			get;
			private set;
		}

		internal TransferOperationResult()
		{
			this.Transfers = new TransferEventArgsCollection();
		}

		internal void AddTransfer(TransferEventArgs operation)
		{
			this.Transfers.InternalAdd(operation);
		}
	}

	[ClassInterface(ClassInterfaceType.AutoDispatch), ComVisible(true)]
	public class TransferEventArgsCollection : ICollection<TransferEventArgs>, IEnumerable<TransferEventArgs>, IEnumerable
	{
		private readonly ReadOnlyInteropCollectionHelper<TransferEventArgs> _helper = new ReadOnlyInteropCollectionHelper<TransferEventArgs>();

		public TransferEventArgs this[int index]
		{
			get	{ return this._helper[index]; }
			set	{ this._helper[index] = value; }
		}

		public void Add(TransferEventArgs item) { this._helper.Add(item); }
		public void Clear() { this._helper.Clear(); }

		// Code snipped for berevity 
        
		internal void InternalAdd(TransferEventArgs item) 
		{
			this._helper.InternalAdd(item);	
		}
        
    }
}
```

So, with `private` setters on the collections, collections abstracted away via `_helper`'s, only `internal` constructors - this is like the trifecta of untestable code... and the rest of the code-base follows the same pattern.

## So, what now?

This is where it gets... fun (in a very perverse way) - we will need to use [Reflection][reflection] to make the required instances that we can then apply behavior to (in other words, we want to find these types, and trick them into thinking that we are in control of them - ignoring the access modifiers)

What does this look like? It looks like this:

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        private IFixture _fixture;

        private T CreateInstance<T>(params object[] args)
        {
            var type = typeof(T);
            var flags = BindingFlags.Instance | BindingFlags.NonPublic;
            var instance = type.Assembly.CreateInstance(type.FullName, false, flags, null, args, null, null);
            return (T)instance;
        }

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }

        [TestMethod]
        public void Download_WithFailingSessionProvider_ShouldLogExceptionFromSessionOpen()
        {
            var exception = CreateInstance<SessionException>(new Session(), string.Empty);
            _sessionProvider.Setup(sp => sp.Open(It.IsAny<SessionOptions>()))
                            .Throws(exception);
            // Act
            _logger.Verify(l => l.Error(exception, It.IsAny<string>()), Times.Once());
        }
    }
}
```

...**and this works**, for the simple case of the `SessionException` where you just need a generic instance of a class with a few simple constructor properties.

What happens if we try this for our test involving the `TransferOperationResult` though?

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        private IFixture _fixture;

        private T CreateInstance<T>(params object[] args)
        {
            var type = typeof(T);
            var flags = BindingFlags.Instance | BindingFlags.NonPublic;
            var instance = type.Assembly.CreateInstance(type.FullName, false, flags, null, args, null, null);
            return (T)instance;
        }

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }
        
        [TestMethod]
        public void Download_WithSuccessfulTransferResult_ShouldReturnTransfers()
        {
            var transferResult = CreateInstance<TransferOperationResult>();
            _sessionProvider.Setup(sp =>
                                sp.GetFiles(It.IsAny<string>(),
                                    It.IsAny<string>(),
                                    false,
                                    It.IsAny<TransferOptions>()))
                            .Returns(transferResult);
            // Act
            result.Results.Count.Should().Be(_fixture.RepeatCount);
        }
    }
}
```

Nope, this still fails, but it fails on the assertion, because the instance we created through reflection is empty; it has no results because of the internal functions I showed above in the decompilation, so the `result.Results.Count` is zero...

What can we do to solve this? We know that there is an `internal` method called `AddTransfer`, can we create an instance of a `TransferEventArgs` object and use reflection to call the method on our instance? In proverbial English there's a saying: _in for a penny, in for a pound_. 

We have started using Reflection, so why not continue? Lets set that up:

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        const FLAGS = BindingFlags.Instance | BindingFlags.NonPublic;
        private IFixture _fixture;

        private T CreateInstance<T>(params object[] args)
        {
            var type = typeof(T);
            
            var instance = type.Assembly.CreateInstance(type.FullName, false, FLAGS, null, args, null, null);
            return (T)instance;
        }
        private void CallMethod<TType, TValue>(TType item, string methodName, TValue args)
        {
            var type = typeof(TType);
            var method = type.GetMethod(methodName, FLAGS);
            method.Invoke(item, new object[] {args});
        }

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }
        
        [TestMethod]
        public void Download_WithSuccessfulTransferResult_ShouldReturnTransfers()
        {
            var transferResult = CreateInstance<TransferOperationResult>();
            for (var i = 0; i < _fixture.RepeatCount; i++)
                CallMethod(instance, "AddTransfer", CreateInstance<TransferEventArgs>());
            _sessionProvider.Setup(sp =>
                                sp.GetFiles(It.IsAny<string>(),
                                    It.IsAny<string>(),
                                    false,
                                    It.IsAny<TransferOptions>()))
                            .Returns(transferResult);
            // Act
            result.Results.Count.Should().Be(_fixture.RepeatCount);
        }
    }
}
```
Yay! It's ugly, but we have a working unit-test that uses Reflection to get the guts of our return object to look how we would expect.

We can do a similar thing with the `AddFailure` results that we need for our tests, and now we're getting somewhere.

## Lets refactor this into a helper

For now, we have a bunch of ugly inline methods, and some "magic strings" in our tests, so lets try and refactor this out into a common class.

Luckily we are using [AutoFixture][autofixture], and it has the concept of [Customisations][customis8n] which we can (ab)use nicely just by throwing this into a customisation class, so lets do that now:

```cs
using System.Reflection;

using Ploeh.AutoFixture;

using WinSCP;

namespace SuperCoolTool78.SFTP.Tests
{
    public class WinScpTypeBuildingCustomisation : ICustomization
    {
        private const BindingFlags FLAGS = BindingFlags.Instance | BindingFlags.NonPublic;
        private const string METHODNAME_ADDTRANSFER = "AddTransfer";

        public void Customize(IFixture fixture)
        {
            fixture.Register(() => CreateInstance<TransferEventArgs>());
            fixture.Register(() =>
            {
                var instance = CreateInstance<TransferOperationResult>();
                for(var i = 0;i < fixture.RepeatCount;i++)
                    CallMethod(instance, METHODNAME_ADDTRANSFER, fixture.Create<TransferEventArgs>());
                return instance;
            });
        }

        private T CreateInstance<T>(params object[] args)
        {
            var type = typeof(T);
            var instance = type.Assembly.CreateInstance(type.FullName, false, FLAGS, null, args, null, null);
            return (T)instance;
        }

        private void CallMethod<TType, TValue>(TType item, string methodName, TValue args)
        {
            var type = typeof(TType);
            var method = type.GetMethod(methodName, FLAGS);
            method.Invoke(item, new object[] {args});
        }
    }
}
```

## Now we can test!

From here, we can then just add this "customisation" to the tests that require it, which means our existing tests above now look like this:

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        private IFixture _fixture;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }
        
        [TestMethod]
        public void Download_WithSuccessfulTransferResult_ShouldReturnTransfers()
        {
            _fixture.Customize(new WinScpTypeBuildingCustomisation());
            _sessionProvider.Setup(sp =>
                                sp.GetFiles(It.IsAny<string>(),
                                    It.IsAny<string>(),
                                    false,
                                    It.IsAny<TransferOptions>()))
                            .ReturnsUsingFixture(_fixture);
            // Act
            result.Results.Count.Should().Be(_fixture.RepeatCount);
        }
    }
}
```
... and it still works!

Additionally, even though the example above is now quite clean and lean, we will eventually need to expand it to support multiple responses, and a success or failure result (as they are mutually exclusive when constructing the return objects)

## So what does a complete test suite look like then?

In my case, with WinSCP, and wanting to test the success or failure of a response, and fetching and deleting some files on a remote resource, my WinSCP `ICustomization` implementation has ended up looking something like this:

```cs
using System;
using System.Reflection;

using Ploeh.AutoFixture;

using WinSCP;

namespace SuperCoolTool78.SFTP.Tests
{
    public class WinScpTypeBuildingCustomisation : ICustomization
    {
        private const string METHODNAME_ADDTRANSFER = "AddTransfer";
        private const string METHODNAME_ADDREMOVAL = "AddRemoval";
        private const string METHODNAME_ADDFAILURE = "AddFailure";
        private const BindingFlags FLAGS = BindingFlags.Instance | BindingFlags.NonPublic;
        private readonly bool _success;

        public WinScpTypeBuildingCustomisation(bool successfulResult = true)
        {
            _success = successfulResult;
        }

        public void Customize(IFixture fixture)
        {
            fixture.Inject(new Session());

            fixture.Register(() => CreateInstance<TransferEventArgs>());
            fixture.Register(() => CreateInstance<RemovalEventArgs>());

            fixture.Register<Session, string, SessionRemoteException>(
                (session, s) => CreateInstance<SessionRemoteException>(session, s));
            fixture.Register<Session, string, Exception, SessionException>(
                (session, s, ex) => CreateInstance<SessionException>(session, s, ex));

            fixture.Register(() =>
            {
                var instance = CreateInstance<TransferOperationResult>();
                if(_success)
                {
                    for(var i = 0;i < fixture.RepeatCount;i++)
                        CallMethod(instance, METHODNAME_ADDTRANSFER, fixture.Create<TransferEventArgs>());
                }
                else
                {
                    for(var i = 0;i < fixture.RepeatCount;i++)
                        CallMethod(instance, METHODNAME_ADDFAILURE, fixture.Create<SessionRemoteException>());
                }
                return instance;
            });

            fixture.Register(() =>
            {
                var instance = CreateInstance<RemovalOperationResult>();
                if(_success)
                {
                    for(var i = 0;i < fixture.RepeatCount;i++)
                        CallMethod(instance, METHODNAME_ADDREMOVAL, fixture.Create<RemovalEventArgs>());
                }
                else
                {
                    for(var i = 0;i < fixture.RepeatCount;i++)
                        CallMethod(instance, METHODNAME_ADDFAILURE, fixture.Create<SessionRemoteException>());
                }
                return instance;
            });
        }

        private T CreateInstance<T>(params object[] args)
        {
            var type = typeof(T);
            var instance = type.Assembly.CreateInstance(type.FullName, false, FLAGS, null, args, null, null);
            return (T)instance;
        }

        private void CallMethod<TType, TValue>(TType item, string methodName, TValue args)
        {
            var type = typeof(TType);
            var method = type.GetMethod(methodName, FLAGS);
            method.Invoke(item, new object[] {args});
        }
    }
}
```

We then consume that in our test classes like this:

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class FileDownloaderTests
    {
        private IFixture _fixture;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
        }
        
        [TestMethod]
        public void Download_WithSuccessfulTransferResult_ShouldReturnTransfers()
        {
            _fixture.Customize(new WinScpTypeBuildingCustomisation());
            _sessionProvider.Setup(sp =>
                                sp.GetFiles(It.IsAny<string>(),
                                    It.IsAny<string>(),
                                    false,
                                    It.IsAny<TransferOptions>()))
                            .ReturnsUsingFixture(_fixture);
            // Act
            result.Results.Count.Should().Be(_fixture.RepeatCount);
        }

                [TestMethod]
        public void Download_WithFailingTransferResult_ShouldReturnFailedTransfers()
        {
            _fixture.Customize(new WinScpTypeBuildingCustomisation(successfulResult:false));
            var transferResult = _fixture.Create<TransferOperationResult>();
            _sessionProvider.Setup(sp =>
                                sp.GetFiles(It.IsAny<string>(),
                                    It.IsAny<string>(),
                                    false,
                                    It.IsAny<TransferOptions>()))
                            .Returns(transferResult);
            // Act
            result.Results.Count.Should().Be(transferResult.Failures.Count);
        }
    }
}
```

... and we're done. We have unit tests that can confirm the behavior of our `sut` by abstracting away & controlling the results from the dependency in our `sut`.

## But we're never truly done...

Now this is not perfect; we're using [Reflection][reflection] all over the place, and this will get even worse when we need to test other return types or return results from the WinSCP library, and I don't mean to pick on WinSCP in this regard, but I do want to demonstrate how ugly and difficult your consuming code gets when a library chooses to use `sealed` classes with `internal` constructors. **Please, just, don't do it.**

All that being said; do you have any better examples, or any suggestions for making this code better than what I've used above?

Let me know in the comments below, or get in touch on [Twitter](https://twitter.com/{{ site.twitter_username }}). I'm really hoping there's a better way!


[last-post]:   {% post_url 2017-01-08-AutoFixture-AutoMoq-and-Unit-Testing %}
[adapter]:     https://en.wikipedia.org/wiki/Adapter_pattern
[autofixture]: https://github.com/AutoFixture/AutoFixture
[customis8n]:  http://blog.ploeh.dk/2011/03/18/EncapsulatingAutoFixtureCustomizations/
[factory]:     https://en.wikipedia.org/wiki/Factory_method_pattern
[moq]:         https://github.com/moq/moq4
[reflection]:  https://msdn.microsoft.com/en-us/library/f7ykdhsy(v=vs.110).aspx
[winscp]:      https://winscp.net/eng/docs/library_install#nuget
