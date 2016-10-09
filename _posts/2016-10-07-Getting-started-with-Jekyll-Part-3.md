---
layout: post
title: "Getting Started with Jekyll - Common Theme Settings"
date: 2016-10-07 00:00:00 +0000
published: true
---

In this post we're going modify our chosen theme a bit, and make it feel more like home.
<!--description-->

1. [Getting Started with Jekyll - Setting the Scene]({% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}) 
2. [Getting Started with Jekyll - Finding a Theme]({% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %})
3. Getting Started with Jekyll - Common Theme Settings **<==**
4. Getting Started with Jekyll - Modifying Templates
5. Getting Started with Jekyll - Setting up Jekyll in Docker
6. Getting Started with Jekyll - Learning Markdown and Liquid
7. Getting Started with Jekyll - Transitioning Content
8. Getting Started with Jekyll - Launching your Site 

## _config.yml is your friend!

Hopefully you've chosen a site that's exactly what you wanted, and you've been able to fork it and clone it down. Now you're just looking at a bunch of files that will produce someone elses site - not so cool. The first step to making it "yours" is to check out the `_config.yml` file. 

The [official documentation][jekyll-conf] is pretty good in listing most values out, but this can be a bit overwhelming, so hopefully your theme's `_config.yml` is well documented, like the below example from my blog:

```markdown
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely need to edit after that.
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'jekyll serve'. If you change this file, please restart the server process.

encoding: utf-8
timezone: UTC

# Site settings
title: Pat Hermens
email: p@hermens.com.au
description: > # this means to ignore newlines until "baseurl:"
  Public speaker, challenge addict, father, husband and (most of all) geek. 
  Interesting problems & inspiring solutions get me out of bed in the morning.

baseurl: "" # the subpath of your site, e.g. /blog
url: "http://hermens.com.au" # the base hostname & protocol for your site

# Social media usernames for filling out links:
twitter_username: phermens 
github_username: PHeonix25 

# Enable posting into the future
future: true

# Build settings
verbose: true
markdown: kramdown
kramdown:
  input: GFM

# Third-party services - just leave some empty to disable it
google_analytics: 
disqus_shortname: 

# used this for post_excerpt at index_page
excerpt_separator: <!--description-->
```

## Whoa, that's a lot of config. What's truly important?

I'd say (from my limited personal experience) that Jekyll has some great defaults, and the only settings you truly need to change are in the `Site settings` block above:

- title
- email
- description
- baseurl
- url

Once those are set correctly, the rest has a lot to do with your site's functionality. You can see from the above that mine came with Google Analytics, Disqus and some in-built links to my Twitter and GitHub accounts - yours may differ slightly, but I'm sure it'll be straight-forward or predictable like the example above.

## So I've provided defaults, what next?

We'll get it up and running in Docker now so that you can preview your new site! [Onward to Part 4!]({% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %})


[jekyll-conf]: https://jekyllrb.com/docs/configuration/