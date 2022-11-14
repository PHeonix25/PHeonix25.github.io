---
layout: post
title: "Getting Started with Jekyll - Modifying Templates"
date: 2016-10-17 00:00:00 +0000
categories: jekyll markdown liquid
published: true
image: /assets/headers/2016-10-17-Getting-started-with-Jekyll-Part-6.png
---

In this post we're going to discuss how we can modify our template using Markdown, Liquid and HTML.
<!--description-->
![2016-10-17-Getting-started-with-Jekyll-Part-6](/assets/headers/2016-10-17-Getting-started-with-Jekyll-Part-6.png)

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme][ph-part2]
3. [Getting Started with Jekyll - Common Theme Settings][ph-part3]
4. [Getting Started with Jekyll - Setting up Jekyll in Docker][ph-part4]
5. [Getting Started with Jekyll - Learning Markdown and Liquid][ph-part5]
6. Getting Started with Jekyll - Modifying Templates **<==**
7. [Getting Started with Jekyll - Transitioning Content][ph-part7]
8. [Getting Started with Jekyll - Launching your Site][ph-part8]

## Jekyll and the file structure

Before we get started, it's worth going over the layout of a Jekyll blog in terms of the file structure - it'll come in handy later.
The [Jekyll documentation][jekyll-docs] (which I've pointed you to time and time again) has a great section on the [required directory structure][jekyll-dirs], and if you've cloned an existing site or an empty theme then it should resemble the docs.
There's also a really clear breakdown over at [Jekyll Bootstrap][jekyll-intro] that I don't want to repeat here as it differs slightly from the official docs but is nice and concise and explains some things with a bit more context.

## So, what are `_layouts`?

Files that go in the `_layouts` directory are sort of like your content templates. They should be written in HTML (and Liquid, but we'll get to that in a minute) and resemble the framework of your final content (the rendered HTML), minus the actual content.

A good starting example might look like the following

{% highlight HTML %}
<!DOCTYPE html>
<html>
  <head>
     <title>My Page Title</title>
  </head>
  <body>
    <div class="page">
      <div class="header">
          My page header goes here.
      </div>
      <div class="content">
          My content goes here.
      </div>
      <div class="footer">
          My footer goes here.
      </div>
    </div>
  </body>
</html>
{% endhighlight %}
> _This snippet can serve as a sample `default.html` that we'll continue to modify._

As you can see, this is plain HTML - nothing fancy - but it gives us a few classes and some placeholders that we'll replace with Liquid commands later in this post.

## OK, so What are `_includes`?

"Includes" are files that you can break out little bits of logic into, and then "include" them in a bigger context. To make this a little more concrete, why don't we make a `header.html` for our page header and include that in our `default.html`?

{% highlight HTML %}
<header class="site-header">
  <h2 class="logo">Welcome!</h2>
  <div class="site-nav">
    <nav>
      <ul class="site-nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </div>
</header>
{% endhighlight %}
> _A sample `header.html` that we will `include` in our `default.html`._

{% highlight HTML %}
<!DOCTYPE html>
<html>
  <head>
     <title>My Page Title</title>
  </head>
  <body>
    <div class="page">
      <div class="header">
        {% raw %}{% include header.html %}{% endraw %}
      </div>
      <div class="content">
        My content goes here.
      </div>
      <div class="footer">
        My footer goes here.
      </div>
    </div>
  </body>
</html>
{% endhighlight %}
> _Our updated `default.html` that includes a reference to our `header.html` now._

As you can see we're using some of the lessons that we learnt from the [previous step][ph-part5], using the Liquid command for `include`. When this gets processed by Jekyll it'll look for that file in your `_includes` directory and lift the content into this document (aka. [transcluding][wiki-trans], like Wikipedia does). This can obviously be nested with great success to break apart logical components of your website (like your header, footer, author information, and any plugins like Google Analytics, or Disqus) into separate files that can be version-controlled (and changed) independently.

## `include` looks cool. What else is there?

Yeah, we've gone over `include`, but what are some of the other keywords that are really going to help us out? I'll start with a list, and link to their formal definitions (in the Jekyll/Liquid documentation) and then we can step through a proper example.

- [`highlight`][jdocs-highl] - Can highlight a block of code. _This is very handy for the examples on this page_
- [`link`][jdocs-link] - Produces a link to an asset or page on the same domain. _It might be easier just to use Markdown though_
- [`post_url`][jdocs-posturl] - Returns the proper (full) link to a post. _It takes domain and stubs (like categories) into account too!_
- [`gist`][jdocs-gist] - Directly embeds a Gist from GitHub. _You could use this instead of `highlight` if you'd prefer._

OK, so that's some of the basics, lets continue building on the sample above:

{% highlight HTML %}
<!DOCTYPE html>
<html>
  <head>
    <title>My Page Title</title>
    <script src="{% raw %}{% link _plugins/GoogleAnalytics.js %}{% endraw %}"></script>
  </head>
  <body>
    <div class="page">
      <div class="header">
        {% raw %}{% include header.html %}{% endraw %}
      </div>
      <div class="content">
        This is my best gist EVAR:
        {% raw %}{% gist PHeonix25/a2ab0bf69f0523382bc1a3cde9547ed4 %}{% endraw %}
        Read more {% raw %}[here][{% post_url 2010-10-01-Awesome-gist.md %}]{% endraw %}!
      </div>
      <div class="footer">
        {% raw %}{% include footer.html %}{% endraw %}
      </div>
    </div>
  </body>
</html>
{% endhighlight %}
>_Now we're using `link`,`include`,`gist` AND `post_url` in our `default.html`!_

Now, the "keywords" that I've mentioned above, are actually called `tags` and you can read a lot more about them at the [offical docs][liquid-tags], but if you check that link out, you'll notice it talks about a whole category of `tags` that can do all sorts of fun "control-flow" stuff. The usual suspects like `if`, `for` and `case/when` are covered, and are pretty straightforward, and you'll probably want to use these to create things like [category pages][ph-archive] or RSS feeds. _Hey, leave it alone, I still love RSS!_

There's an even better part to writing your posts with Jekyll though, and those are "mix-ins" or [`filters`][jekyll-filter]! These are really cool things that can manipulate the values provided by `tags` - things like converting dates, escaping XML, creating JSON, or even limit, filter or group collections. These things are really powerful and there are plenty of them. There's the ones that are added to [Jekyll][jekyll-filter], and the base ones that come from [Liquid][liquid-filter] itself, so it's worth checking them out in order to make our own template modifications!

Now I know that was a whole lot to swallow and comprehend, so it might be nicer to just drop you in the deep end and show you how crazy this markup can get by dropping my [`feed.xml`][ph-feed] in here as an example:
{% highlight XML %}
{% raw %}
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ site.title | xml_escape }}</title>
    <description>{{ site.description | xml_escape }}</description>
    <link>{{ site.url }}{{ site.baseurl }}/</link>
    <atom:link href="{{ "/feed.xml" | prepend: site.baseurl | prepend: site.url }}" rel="self" type="application/rss+xml"/>
    <pubDate>{{ site.time | date_to_rfc822 }}</pubDate>
    <lastBuildDate>{{ site.time | date_to_rfc822 }}</lastBuildDate>
    <generator>Jekyll v{{ jekyll.version }}</generator>
    {% for post in site.posts limit:10 %}
      <item>
        <title>{{ post.title | xml_escape }}</title>
        <description>{{ post.content | xml_escape }}</description>
        <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
        <link>{{ post.url | prepend: site.baseurl | prepend: site.url }}</link>
        <guid isPermaLink="true">{{ post.url | prepend: site.baseurl | prepend: site.url }}</guid>
        {% for tag in post.tags %}
        <category>{{ tag | xml_escape }}</category>
        {% endfor %}
        {% for cat in post.categories %}
        <category>{{ cat | xml_escape }}</category>
        {% endfor %}
      </item>
    {% endfor %}
  </channel>
</rss>
{% endraw %}
{% endhighlight %}
> _All those `for`'s and `if`'s and `xml_escape`'s - oh my!_

## It's time to write our own `_include`

I think we've talked enough. Let's put all this into practise and make our own `_include`. We'll keep it simple for now, and just try and add Google Analytics to our site by adding a script on the bottom of every page.

Let's start with our `_layouts` - probably the `default` one. We're going to want to add Google Analytics to our footer (_like all good web developers that put all unnecessary scripts below the fold_), so lets stick a `include` directive just above our closing body tag:

{% highlight HTML %}
<!DOCTYPE html>
<html>
  <head>
    <title>My Page Title</title>
    <script src="{% raw %}{% link _plugins/GoogleAnalytics.js %}{% endraw %}"></script>
  </head>
  <body>
    <div class="page">
      <div class="header">
        {% raw %}{% include header.html %}{% endraw %}
      </div>
      <div class="content">
        This is my best gist EVAR:
        {% raw %}{% gist PHeonix25/a2ab0bf69f0523382bc1a3cde9547ed4 %}{% endraw %}
        Read more {% raw %}[here][{% post_url 2010-10-01-Awesome-gist.md %}]{% endraw %}!
      </div>
      <div class="footer">
        {% raw %}{% include footer.html %}{% endraw %}
        {% raw %}{% include googleanalytics.html %}{% endraw %}
      </div>
    </div>
  </body>
</html>
{% endhighlight %}
>_Our updated `default.html` with an `include` directive for a `googleanalytics.html` file_

> **NOTE** You may prefer to abstract this out into your transcluded `footer` instead, or it might fit completely differently with your theme, but if you follow along, you'll surely get the point and can adapt it to your requirements. Maybe you want to add your [Stack Overflow flair badge][stack-badge] to your [About Me][ph-aboutme] page instead?

Now, if you try and compile your site at this point in time, you'll probably get a nice big compilation error, so save this file and lets immediately create a `googleanalytics.html` file in our `_includes` folder!

For completion's sake, lets say it contains something like the following:
{% highlight javascript %}
{% raw %}
{% if site.google_analytics %}
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName[o](0);a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', '{{ site.google_analytics }}', 'auto');
  ga('send', 'pageview');
</script>
{% endif %}
{% endraw %}
{% endhighlight %}

You'll notice here that we're using more of Liquid's "control flow" `tag`s to check if the `site` has a `google_analytics` value in it's `_config.yaml`: `{% raw %}{% if site.google_analytics %}{% endraw %}`, and then again inside the javascript declaration itself to lift that value (transclude it) into our resulting output:  `{% raw %}ga('create', '{{ site.google_analytics }}', 'auto');{% endraw %}` - hopefully this shows you some of the power I was talking above above. Once you get used to working with the Jekyll (and Liquid) `tags` and `filters` you won't be able to go back to plain Markdown!

Once we've added this, we can rebuild our site (or save the files and refresh our browser if we got the Docker volume mounts working in [Part 4][ph-part4]) and inspect the output and - provided we set a value in our `_config.yml` for `google_analytics` and **restarted our build process to pick up this change** - it should look something like the below:

{% highlight HTML %}
{% raw %}
    <!-- ... the rest of the page and then: -->
    </div>
    <div class="footer">
      <!-- The contents of footer.html should be here -->
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName[o](0);a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-XXXXXXXX-X', 'auto');
        ga('send', 'pageview');
      </script>
    </div>
  </body>
</html>
{% endraw %}
{% endhighlight %}

Yay us, we just wrote our first transcluded template modification!

So long as you know SOME basics about HTML and understand the Jekyll and Liquid commands we've used above, you should be well on your way to completely personalising your own theme -- or at least adding your own "plugins" and customisations... 🙂

## I'm happy with this. What's next?

In the next step, we'll assume that we've customised our theme a bit (and it's still running fine after [we set it up in Docker][ph-part4]) - so lets move on to some of the more difficult steps, like getting our old content migrated into this new setup.

I'll talk (very generally) about how to do this from Wordpress and some other CMS's over in [Part 7][ph-part7].

[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}
[ph-part8]:   {% post_url 2016-10-22-Getting-started-with-Jekyll-Part-8 %}
[ph-archive]: /archive
[ph-feed]:    /feed.xml
[ph-aboutme]: /about

[jekyll-docs]:   https://jekyllrb.com/docs/home/
[jekyll-dirs]:   https://jekyllrb.com/docs/structure/
[jekyll-intro]:  http://jekyllbootstrap.com/lessons/jekyll-introduction.html#toc_6
[wiki-trans]:    https://en.wikipedia.org/wiki/Transclusion
[jdocs-highl]:   https://jekyllrb.com/docs/templates/#code-snippet-highlighting
[jdocs-link]:    https://jekyllrb.com/docs/templates/#link
[jdocs-posturl]: https://jekyllrb.com/docs/templates/#post-url
[jdocs-gist]:    https://jekyllrb.com/docs/templates/#gist
[liquid-tags]:   http://shopify.github.io/liquid/tags/
[jekyll-filter]: https://jekyllrb.com/docs/templates/#filters
[liquid-filter]: https://shopify.github.io/liquid/filters/
[stack-badge]:   http://stackexchange.com/users/flair/1261.png?theme=clean
