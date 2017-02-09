---
layout: post
title: "Getting Started with Jekyll - Transitioning Content"
date: 2016-10-20 00:00:00 +0000
categories: jekyll
published: true
image: /assets/headers/2016-10-20-Getting-started-with-Jekyll-Part-7.png
---

In this post we're going to discuss how we can move our content from our existing blog.
<!--description-->
![2016-10-20-Getting-started-with-Jekyll-Part-7](/assets/headers/2016-10-20-Getting-started-with-Jekyll-Part-7.png)

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme][ph-part2]
3. [Getting Started with Jekyll - Common Theme Settings][ph-part3]
4. [Getting Started with Jekyll - Setting up Jekyll in Docker][ph-part4]
5. [Getting Started with Jekyll - Learning Markdown and Liquid][ph-part5]
6. [Getting Started with Jekyll - Modifying Templates][ph-part6]
7. Getting Started with Jekyll - Transitioning Content **<==**
8. [Getting Started with Jekyll - Launching your Site][ph-part8]

## Nice and simple

By now I'm sure you guys are sick of listening to me waffle on, and thankfully, for this part, you won't have to.

Long story short; when I was originally designing this series of posts, I wasn't aware of a lot of the community surrounding Jekyll and how involved they truly are (mind you - Jekyll has been around for [nearly 10 years][jekyll-wiki]!) - I've learnt a lot by writing this series of posts, and so the best I can do for you now is show you where some of the best resources are found.

## Show me the ... docs

In terms of migrating content from an existing site, you really can't go past the [official documentation][jekyll-docs] which will point you towards their sister site: [Jekyll Import][jekyll-import]. From there, it's just a matter of following the steps for the system that you're coming from! Tried, proven, working, and with over 20 documented importers, you should be able to find yours in the list.

## Yeah, but these are for 'ruby' people

Granted, most of the import documentation assumes that you have a locally available version of your site, and a locally available version of Ruby and all the Gems for Jekyll. Thankfully, after our experience in [Part 4][ph-part4] of working with Docker containers, we can re-use this knowledge and run this in an interactive Docker container!

For now, here's a series of steps that'll help you get it up and running in an interactive session so that you can test it out, and if it all works fine, then you should be able to copy the files (_provided you have your mount points working_) onto your local system and then copy them into your new site!

Let's run the following script step by step from Powershell:

```powershell
# Run the standard Jekyll image interactively and start a bash session:
docker run --rm -ti -v $(pwd):/usr/content jekyll/jekyll /bin/sh

# Update ourselves and install Ruby dev tools:
apk add --update ruby-dev

# Update GEM so that we can find our packages 
# without SSL cert errors - this could take a while!
gem update --system && gem update && gem cleanup

# Install the Jekyll Import module:
gem install jekyll-import

# Change to our mounted directory:
cd /usr/content

# Now go ahead and install your other importers and go nuts :)
```

## Working with the final output

Thankfully the files that the `jekyll-import` gem produces are normally pretty clean, and should slot straight into your sites theme, but of course, that cannot be guaranteed and it's probably best that you double check every, single, page. ☹  

## Great, I've got a whole lot of content to parse

Yep, but good work on creating all that previous content - I'm envious. 

For now, we should be done migrating our existing content to Markdown/Liquid and have them rendering in our new site, so jump over to the last part: `git push`ing your site and sending it live!



[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part6]:   {% post_url 2016-10-17-Getting-started-with-Jekyll-Part-6 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}
[ph-part8]:   {% post_url 2016-10-22-Getting-started-with-Jekyll-Part-8 %}

[jekyll-wiki]:   https://en.wikipedia.org/wiki/Jekyll_(software)#History
[jekyll-docs]:   http://jekyllrb.com/docs/migrations/
[jekyll-import]: https://import.jekyllrb.com/docs/home/ 
