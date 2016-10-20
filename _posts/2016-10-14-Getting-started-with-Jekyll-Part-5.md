---
layout: post
title: "Getting Started with Jekyll - Learning Markdown and Liquid"
date: 2016-10-14 00:00:00 +0000
categories: jekyll markdown liquid
published: true
---

In this post we're going to go over a few tips and tricks for working with Markdown and Liquid, in the context of creating Jekyll pages and posts.
<!--description-->

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme][ph-part2]
3. [Getting Started with Jekyll - Common Theme Settings][ph-part3]
4. [Getting Started with Jekyll - Setting up Jekyll in Docker][ph-part4]
5. Getting Started with Jekyll - Learning Markdown and Liquid **<==**
6. [Getting Started with Jekyll - Modifying Templates][ph-part6]
7. [Getting Started with Jekyll - Transitioning Content][ph-part7]
8. Getting Started with Jekyll - Launching your Site 

## Wait, what is Markdown?
To quote [Wikipedia][wiki-md]: 

> Markdown is a lightweight markup language with plain text formatting syntax designed so that it can be converted to HTML and many other formats using a tool by the same name.

OK, so Markdown is a `lightweight markup language`, but what is a [LML][wiki-lml]?

> A lightweight markup language (or LML), also termed a simple or humane markup language, is a markup language with simple, unobtrusive syntax.
> It is designed to be easy to create using any generic text editor, as well as easy to read in its raw form.
> Lightweight markup languages are used in applications where it may be necessary to read the raw document as well as the final rendered output  
 
Ah, so now we're getting somewhere! Basically, it's a way of writing documents that are laid out simply, are easy to read, and able to be converted something that we can render as HTML.
As an example, here's a screenshot of me preparing this post in Markdown (in VS Code):

![Markdown screenshot](/assets/img/markdown_example.png)

## What is Liquid then?

To quote the creators [Shopify][liquid]

> [Liquid is a] safe, customer facing template language for flexible web apps.
> [It] is an open-source template language created by Shopify and written in Ruby. 
> It is the backbone of Shopify themes and is used to load dynamic content on storefronts.

Right, so from this we can figure out that Liquid is a combination of a parser and a renderer that works in a similar way to Markdown, but is primarily used for additional functionality before Markdown converts the plaintext to HTML.

As an example; In the screenshot above, you can see that I've used the Liquid functionality for linking to posts `post_url` inside Liquid template placeholders {% raw %}`{%  %}`{% endraw %} to return the correct full URL for a post, and then I've used the Markdown functionality for hyperlinking `[My text](my link)` to link to it. So they work very well together.

The documentation on the Jekyll site about [how it uses Liquid][jekyll-lqd] is really comprehensive and can do this topic a lot more justice than I ever could so you can continue over there if you want to see the complete suite of functionality. Also don't forget to check out the documentation for [Liquid itself][liquid] which is very clean and clear.  

## This seems complex... what alternatives are there?

As Jekyll comes with Liquid baked in, at this point in time, the only other alternative is to write your posts/pages in plain Markdown - but this will mean you're losing out on some of the best functionality of creating your site with Jekyll!

It's definitely worth learning some of the basics, and even if you're not a "techy person", I've included a lot of links to resources above that should lay it on you slowly. Take your time, there's no rush. 

## Basic formatting in Markdown

So, now we understand what Markdown and Liquid are, it's time to get into the fun...

First of all, we would be remiss to talk about Markdown without linking to [John Gruber's definitive syntax resource][md-syntax] - he is the creator of Markdown, and all the functionality is covered off there so it's a great place to start. He has even built a "Markdown test bed", called [Dingus][dingus], where you can get some practice in, if you're trying out something new. While you're at it, if this is all new for you, I'd advise you to start at [the start of his series of pages on Markdown][markdown]! It's a great read and is very simple to follow along with and will get you up to speed in no time at all.

Once you're done over there, I have a little surprise for you. Not all Markdown's are created equal... Remember back in [Part 3]() where we wrote the following little snippet in our config file?

```YAML
kramdown:
  input: GFM
```

Yeah, that's because we're using `GFM` or `GitHub Flavoured Markdown` as formatting for our posts.

Github Flavoured Markdown is *slightly* different to John Grubers original Markdown (*which are different to Pandoc, CommonMark and MultiMarkdown as well*) in that each of these variants have pushed themselves to include things that weren't in John Grubers original spec (like the concepts of footnotes or math support). GitHub Flavoured Markdown was created by GitHub (*surpriiiise*) and basically adds

- syntax highlighting on code fencing (using three backticks, and the language name), 
- task lists (using square brackets in a list), and 
- tables (using hyphens and pipe characters). 

A lot of these details are covered on their [Mastering Markdown][mastering] guide, especially the [GFM][master-gfm] section, so give that a read. Play with the basic functionality in [Dingus][dingus] and then start experimenting on your own posts!

## Jekyll features with Liquid

I mentioned this above, with the link to the [Jekyll documentation about Liquid][jekyll-lqd], but it's worth noting again, there are some really cool things you can do with Liquid. 

The first one is obviously the most basic: `post_url`, which can return a complete link to a post, ready for Markdown, like this: `{% raw %}{% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}{% endraw %}` which will turn into this: `{% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}` - you don't need the extension, or the folder, so long as you're following some of the advised Jekyll folder structures.

The second one that is really handy for a technical blog, is the ability to use [Rouge][rouge] or [Pygments][pygments] to highlight your syntax. Rouge supports a whole heap of languages, and more are being added as time goes on. You can find the latest list [here][rouge-lang] along with all the alias' you'll need.

> **NOTE** Pygments is not available on GitHub Pages, but Rouge is. Rouge is also the offically supported highlighter in Jekyll 3.0+. Stick with Rouge if you're starting out.

Again, it's really straightforward (*lifting the example from the documentation itself*) you start with `{% raw %}{% highlight LANGUAGE %}{% endraw %}` and end with `{% raw %}{% endhighlight %}{% endraw %}`, like the following:

```liquid
{% raw %}{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}{% endraw %}
```

which produces this nice output, indented and coloured perfectly:
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}

*Tadaaaaa*.

## Tying it all together, with examples!

So I've give you a few example above (*including a screenshot, what more could you want?*), but so long as you remember 

- the processing order: Liquid commands first, then Markdown, & 
- the syntax: `[Square braces for link text][{% raw %}{% post_url 2010-01-01-for-your-post %}{% endraw%}]`

Then you're good to go!

Now, one thing I haven't touched on, is some Markdown/post-etiquette tips, like putting your (named) links at the bottom of your post or linking (relatively) to assets. 
Having named links will help for referencing them later, and it's easy to see what you're linking to and replace it once if it needs updating.
For your reference, here's what the bottom of this post looks like so far with all the named links you could ever want:

![so many links](/assets/img/post_link_example.png)

Small things like this will help you later on - trust me, so it's worth learning Markdown properly if you want to do this seriously.

## TLDR; Links pls.

So this post is getting quite long, and (*as usual*) there's quite a lot of opinion tussed in amongst the facts above, so for those of you that want to skip the bullshit, here's where you need to go to get up to speed on writing your posts in Jekyll:

- [Liquid Basics][liquid]
- [Liquid in Jekyll][jekyll-lqd]
- [Markdown Basics][markdown]
- [Markdown Syntax][md-syntax]
- [Markdown Tester, aka. Dingus][dingus]
- [GitHub's Guide to 'Mastering Markdown'][mastering]
- [GitHub's explanation of 'GFM' extras][master-gfm]
- [Rouge's list of supported languages][rouge-lang]

## Ok, this is cool. What's next?

In the next section, we're going to use this new-found knowledge of Markdown and Liquid to modify our templates. We'll also go through setting up some `_includes` and some `_layouts` and maybe even a static page (or two), so, get familiar with these two new languages and their syntax and we'll continue into [Part 6][ph-part6].

[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part6]:   {% post_url 2016-10-17-Getting-started-with-Jekyll-Part-6 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}

[wiki-md]:    https://en.wikipedia.org/wiki/Markdown
[wiki-lml]:   https://en.wikipedia.org/wiki/Lightweight_markup_language
[liquid]:     https://shopify.github.io/liquid/basics/introduction/
[jekyll-lqd]: https://jekyllrb.com/docs/templates/
[markdown]:   https://daringfireball.net/projects/markdown/
[dingus]:     https://daringfireball.net/projects/markdown/dingus
[md-syntax]:  https://daringfireball.net/projects/markdown/syntax
[mastering]:  https://guides.github.com/features/mastering-markdown/
[master-gfm]: https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown
[rouge]:      http://rouge.jneen.net/
[rouge-lang]: https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers
[pygments]:   http://pygments.org
