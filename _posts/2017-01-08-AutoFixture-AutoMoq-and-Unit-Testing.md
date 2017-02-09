---
layout: post
title: "AutoFixture, AutoMoq, and Unit Tests with Specimen Builders"
date: 2017-01-08 00:00:00 +0000
categories: unit-testing
published: true
---

I'm a big fan of unit-testing. I especially like unit testing that is simple, clean and easy to follow. It gives me a good feeling that the rest of the code that is behind the tests is easy to understand and easy to maintain, and whilst this isn't *always* true, from my experience, it's pretty close. 
<!--description-->
![2017-01-08-AutoFixture-AutoMoq-and-Unit-Testing](/assets/headers/2017-01-08-AutoFixture-AutoMoq-and-Unit-Testing.png)

Some of the best tools that I've found to help with making clean, clear, reliable unit-tests are [AutoFixture][tool-af] and [Moq][tool-moq]. Using the combination of these two, we can generate some REALLY clean tests with (relatively) randomised input data.

## Let's cover a project

Recently, I've had the opportunity to go back to one of my previous [hackathon][hackathon] projects, a dashboard for representing internal numbers on some of the [dashboard screens][canteen] here in the office at Coolblue, and make it a bit more "production-ready". One of the ways that I've started making it a bit more reliable is by covering everything with unit-tests -- primarily so we can be sure it DOES do what we want it to do. 

At the same time, we have a few people in the office that are still quite new to unit testing, and how to refactor code-bases to integrate better with tests (no more inline `new` statements!) so I've been making some of these "upgrades" into Pull Requests on GitHub for other people to review.

## Where we started from

We had a class, pretty simple and straightforward. Only one function to test, and only one injected class. _"Perfect! Easy!"_ I hear you say... :)

It looked something like this:

```cs
using WinSCP;

namespace SuperCoolTool78.SFTP
{
    public class SftpSessionOptionsCreator : ISessionOptionsCreator
    {
        private readonly Settings _settings;

        public SftpSessionOptionsCreator(Settings settings)
        {
            _settings = settings;
        }

        public SessionOptions Create() =>
            new SessionOptions
            {
                Protocol = Protocol.Sftp,
                HostName = _settings.RemoteHostName,
                UserName = _settings.RemoteUserName,
                PortNumber = _settings.RemotePortNumber,
                SshHostKeyFingerprint = _settings.RemoteSshHostKeyFingerprint,
                SshPrivateKeyPath = _settings.RemoteSshPrivateKeyPath
            };
    }
}
```

So naturally, using my favourite tooling, I set up some unit tests:

```cs
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ploeh.AutoFixture;
using Ploeh.AutoFixture.AutoMoq;

namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class SftpSessionOptionsCreatorTests
    {
        private IFixture _fixture;
        private Settings _settings;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
            _settings = _fixture.Freeze<Settings>();
        }

        [TestMethod]
        public void Create_GivenAppropriateSettings_ShouldReturnHostNameFromSettings()
        {
            var sut = _fixture.Create<SftpSessionOptionsCreator>();

            var result = sut.Create();

            result.HostName.Should().Be(_settings.RemoteHostName);
        }
    }
}
```

... and YAY, we have our first test! 

**But it fails.**

 _"How!? It's three lines of code"_ you say.

Well, this little bad boy of an exception is thrown by our instantiation of the `SessionOptionsCreator.Create()` method:

```
System.ArgumentException: SSH host key fingerprint "RemoteSshHostKeyFingerprintb53defcd-7a9a-4fc2-9532-067f009fd7fa" does not match pattern /((ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp(256|384|521))( |-))?(\d+ )?([0-9a-f]{2}(:|-)){15}[0-9a-f]{2}(;((ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp(256|384|521))( |-))?(\d+ )?([0-9a-f]{2}(:|-)){15}[0-9a-f]{2})*/
```

Ah, OK, so it needs a very specific format for it's own constructor. Let's not worry about how troublesome this type of verification is, and just appreciate that we learnt about this now - and thank AutoFixture for that randomised `RemoteSshHostKeyFingerprintb53defcd-7a9a-4fc2-9532-067f009fd7fa` input value!

Now, we could just hardcode our "expected" input value for that property and call it a day, but that's ugly (and almost sinful in terms of achieving our goal of idempotent, yet randomised tests), so lets find a better way.

## Getting somewhere

So if we need a specific **format** for that property, lets give that property a specific format...

We can see from the error that our test throws, that the `SessionOptions` constructor error message contains a regex, so let's break that down. Starting with the last part: `([0-9a-f]{2}(:|-)){15}[0-9a-f]{2})` - this means we need any `0-9` or `a-f` two-character pair (_note: lowercase_) values, followed by a `:` or a `-`, 15 times, followed by a `0-9`/`a-f` two-character pair. Thankfully, the `a-f` gives away that we're looking for hex values, and 16 pairs sounds about right for a lower-cased, hex-ified GUID value!

We also need to satisfy the rest of the regex: `((ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp(256|384|521))( |-))`. Now, I'm sure that we can find a way to get AutoFixture to generate one of these required values, but I'm also a pragmatist and we need to draw the line somewhere, so lets just hardcode this half of the required input with the understanding that the other half of the input string will be randomised.

For now, something like this looks like it might work to generate the second half of the required string:

```cs
string GenerateOctetString_UGLY()
{
    var guidAsOctetString = new StringBuilder();
    var newGuid = Guid.NewGuid();
    var guidBytes = newGuid.ToByteArray();

    foreach(var b in guidBytes)
        guidAsOctetString.Append(b.ToString("x2") + ':'); 
    
    var result = guidAsOctetString.ToString();
    var clean = result.TrimEnd(':'); // We have one spare at the end of the loop
    return clean;
}
```

Writing something like this means that we can set a breakpoint, and step through each operation and ensure that it behaves the way that it's supposed to. Writing loops with Guids and special formatting strings and looped concatenation is hard enough to get perfect on the first go, so lets make sure we have our "basic logic" down first. 

> NOTE: the "`x2`" in the `.ToString()` call is just one of the [Standard Formatting Strings][msdn-sfs] that are well worth memorising (_or at least keeping bookmarked_) which will convert an integral type (_in our case a byte_) into a two character lowercase hex-code.

Once we have a function like this, we can probably optimise it, turn it into a lambda-function and put it in our test initialise, so let's do that now:

```cs
namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class SftpSessionOptionsCreatorTests
    {
        private const string SSH_HOSTKEY_PREFIX = "ssh-ed25519 256 ";
        private IFixture _fixture;
        private Settings _settings;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());

            Func<string> generateOctetString = () =>
            {
                var guidAsOctetString = new StringBuilder();

                foreach(var b in Guid.NewGuid().ToByteArray())
                    guidAsOctetString.Append($"{b:x2}:"); 

                return guidAsOctetString.ToString().TrimEnd(':');
            };

            var fakeFingerprint = SSH_HOSTKEY_PREFIX + generateOctetString();

            _settings = _fixture.Build<Settings>()
                                .With(p => p.RemoteSshHostKeyFingerprint, fakeFingerprint)
                                .Create();
            _settings = _fixture.Freeze<Settings>();
        }

        [TestMethod]
        public void Create_GivenAppropriateSettings_ShouldReturnHostNameFromSettings()
        {
            var sut = _fixture.Create<SftpSessionOptionsCreator>();

            var result = sut.Create();

            result.HostName.Should().Be(_settings.RemoteHostName);
        }
        ... etc.
    }
}
```

... and yay! It passes! It's green! Let's go to Production! Git push all the things! 

But boy, this `TestInitialize` function has become ... well, something isn't quite right there, and it's very distracting from what we're trying to achieve. Mind you, even with all that considered, at this point it was quite late and I was just happy to make a PR in GitHub and log off for the day. 

That was, until I got questioned by a very curious colleage the following day that was trying to understand what I was trying to achieve, without seeing the error or understanding how it was involved with testing the `SftpSessionOptionsCreator` class... and she was very right! 

There should be a cleaner and/or clearer way to solve this problem without resulting to "generate a 'weird' fake string on every test run, append it to a fixed value and set it for this property, but generate the rest and then run my tests"

Additionally, she highlighted to me that if I wanted to add this same "behaviour" to any other classes, then this would get pretty ugly pretty quick (copy/paste, or dependency injecting into your test classes, or writing "helper functions")

## Yup, this could be better!

Now, it's time to dive a bit deeper into [AutoFixture][tool-af] for a moment; AutoFixture has the concept of "Specimen Builders" for "convention-based customisations". I would do a disservice to [Mark Seemann][ploeh] himself if I didn't link to his [awesome documentation of this feature][ploeh-cbc] at this stage. Needless to say, if you're trying to achieve something like I was, this is probably the right way to go about it.

If we convert the logic that we have above in our initialiser into a ISpecimenBuilder, it should look something like this:

```cs
public class SshHostKeySpecimenBuilder : ISpecimenBuilder
{
    private const string SSH_HOSTKEY_PREFIX = "ssh-ed25519 256 ";
    private const string PROPERTY_NAME = "RemoteSshHostKeyFingerprint";

    public object Create(object request, ISpecimenContext context)
    {
        var propertyInfo = request as PropertyInfo;

        if(propertyInfo != null &&
            propertyInfo.PropertyType == typeof(string) &&
            propertyInfo.Name.Equals(PROPERTY_NAME, 
                StringComparison.CurrentCultureIgnoreCase))
        {
            var guidAsOctetString = new StringBuilder();

            foreach(var b in Guid.NewGuid().ToByteArray())
                guidAsOctetString.Append($"{b:x2}:");

            var octetString = guidAsOctetString.ToString().TrimEnd(':');

            return SSH_HOSTKEY_PREFIX + octetString;
        }

        return new NoSpecimen();
    }
}
```

Basically, this says, if there we are looking at a property (because `SpecimenBuilders` get called for just about every `request` that AutoFixture needs to handle), and that property identifes of type `string`, and the `Name` of that property matches the `PROPERTY_NAME` value that we are looking for - ignoring the letter casing, then we should apply our customisation function. 

Otherwise we just return the default `NoSpecimen` function, which is the default behaviour of a `SpecimenBuilder` that doesn't match the given input. 

We can then just reference this behaviour in the test initialisation for the classes we need to apply this rule to, and our test classes will be much cleaner, and much more focussed.

## Ah, there we go

So now, we end up with something like the following:

```cs
namespace SuperCoolTool78.SFTP.Tests
{
    [TestClass]
    public class SftpSessionOptionsCreatorTests
    {
        private IFixture _fixture;
        private Settings _settings;

        [TestInitialize]
        public void Initialise()
        {
            _fixture = new Fixture().Customize(new AutoConfiguredMoqCustomization());
            _fixture.Customizations.Add(new SshHostKeySpecimenBuilder());

            _settings = _fixture.Freeze<Settings>();
        }

        [TestMethod]
        public void Create_GivenAppropriateSettings_ShouldReturnHostNameFromSettings()
        {
            var sut = _fixture.Create<SftpSessionOptionsCreator>();

            var result = sut.Create();

            result.HostName.Should().Be(_settings.RemoteHostName);
        }
        ... etc.
    }
}
```

... and there we go, we are back to the cleanliness of the original tests, and we have our "customised behaviour" that is only applicable to tests in this class - AND any other that we need to add this "customisation" to!

With this PR created, my colleague and I were both much happier with the intent, and the implementation.

## Tools we've used above:

To wrap up, I would advise if you're Unit Testing in any of the .Net languages that you look into the following tools:

* [AutoFixture][tool-af] - Generates pseudo-random values for any property on any type used in your tests!
* [Moq][tool-moq] - Super simple mocking framework for setting up replacement behaviours for test scenarios.
* [AutoMoq][tool-amoq] - A plugin that stiches Moq with AutoFixture to give you automatic behaviours
* [FluentAssertions][tool-fa] - A great little library that allows you to phrase your test assertions as statements 
* [NCrunch][tool-nc] - a VS plugin that's able to run and debug your tests, all while you're writing your code!


[hackathon]: http://blog.coolblue.nl/de-coolblue-hackathon-2016
[canteen]:   https://www.google.com/maps/@51.9228969,4.4725992,3a,30y,333.67h,99.11t/data=!3m7!1e1!3m5!1s4sWFAZLORBsAAAQGD3NnvA!2e0!3e2!7i13312!8i6656?hl=en
[msdn-sfs]:  https://msdn.microsoft.com/en-us/library/dwhawy9k(v=vs.110).aspx
[ploeh]:     http://blog.ploeh.dk/about/
[ploeh-cbc]: http://blog.ploeh.dk/2010/10/19/Convention-basedCustomizationswithAutoFixture/
[tool-af]:   https://github.com/AutoFixture/AutoFixture
[tool-fa]:   http://www.fluentassertions.com/
[tool-nc]:   http://www.ncrunch.net/
[tool-moq]:  https://github.com/moq/moq4
[tool-amoq]: http://blog.ploeh.dk/2010/08/19/AutoFixtureasanauto-mockingcontainer/
