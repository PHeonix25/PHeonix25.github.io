---
layout: post
title: "Getting Started with Jekyll - Common Theme Settings"
date: 2016-10-07 00:00:00 +0000
categories: jekyll theme
published: true
---

In this post we're going modify our chosen theme a bit, and make it feel more like home.
<!--description-->

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme][ph-part2]
3. Getting Started with Jekyll - Common Theme Settings **<==**
4. [Getting Started with Jekyll - Setting up Jekyll in Docker][ph-part4] 
5. [Getting Started with Jekyll - Learning Markdown and Liquid][ph-part5]
6. [Getting Started with Jekyll - Modifying Templates][ph-part6]
7. [Getting Started with Jekyll - Transitioning Content][ph-part7]
8. [Getting Started with Jekyll - Launching your Site][ph-part8] 

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
  This description will appear in Google search results,
  and in the meta-data of your site, so make sure you
  type up something short that defines you...

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

- `title`: What do you want your site to be called?
- `description`: Meta values for your social media sharing stuff
- `baseurl`: Do you want to put the site in a subdirectory? 
- `url`: This is used with the `baseurl` above to find assets in themes.

Once those are set correctly, the rest has a lot to do with your site's functionality. You can see from the above that mine came with Google Analytics, Disqus and some in-built links to my Twitter and GitHub accounts - yours may differ slightly, but I'm sure it'll be straight-forward or predictable like the example above.

## So I've provided defaults, what next?

We'll get it up and running in Docker now so that you can preview your new site! [Onward to Part 4!][ph-part4]


[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part6]:   {% post_url 2016-10-17-Getting-started-with-Jekyll-Part-6 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}
[ph-part8]:   {% post_url 2016-10-22-Getting-started-with-Jekyll-Part-8 %}

[jekyll-conf]: https://jekyllrb.com/docs/configuration/