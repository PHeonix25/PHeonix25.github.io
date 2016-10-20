---
layout: post
title: "Getting Started with Jekyll - Finding a Theme"
date: 2016-10-05 00:00:00 +0000
categories: jekyll theme
published: true
---

In this post we're going to try and find a theme, and see why that might be the easiest way to get started.
<!--description-->

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme **<==**
3. [Getting Started with Jekyll - Common Theme Settings][ph-part3] 
4. [Getting Started with Jekyll - Setting up Jekyll in Docker][ph-part4] 
5. [Getting Started with Jekyll - Learning Markdown and Liquid][ph-part5]
6. [Getting Started with Jekyll - Modifying Templates][ph-part6]
7. [Getting Started with Jekyll - Transitioning Content][ph-part7]
8. Getting Started with Jekyll - Launching your Site 

## Why find a theme first?

Long story short, it's much easier to copy then it is to create, both in life and in getting started with Jekyll. Hence, finding a theme you like, and then forking it is much easier than trying to write "your perfect one" from scratch. Most demo-ed Jekyll themes also come with placeholder posts, author pages, widgets/add-ons (like Disqus comments, social media links, etc.) that will kickstart you and then you just need to modify to personalise your site. 

Personally, I found this a much quicker way to get started compared to the official [Quick Start Guide][jekyll-qs], but if you would prefer, you can easily follow the Quick Start Guide, and then come back at [Part 3][ph-part3].

## You've got me sold, so where can I find a good one?

When I was looking for a simple theme, I found the following sites very handy. Some have different features, like sorting or showcasing theme statistics, but for the most part it's safe to grab one from any of the following sites that tickles your fancy:

- [JekyllThemes.org][jekyll-thm1],
- [Themes.JekyllRc.org][jekyll-thm2],
- [JekyllThemes.io][jekyll-thm3],
- and of course; [Google][google-thms]!

Keep in mind, in the next post I'll go over what it takes to modify your chosen theme, and there's some really good information in the official Jekyll documentation if you want to [write one yourself][jekyll-wyot], but for now I'll assume you found something half-decent on the Internet somewhere...

## Great, I found something I like!

Cool, nice work. Now presuming it's open-source and hosted on GitHub, just fork it and clone it down to your future "blogging machine" - keep in mind, most complete Jekyll installations are measures in kilobytes, not megabytes so this really shouldn't take too long. This complete folder (measured in kilobytes) is now a working blog, and thusly, it'll form the start of your future site, but don't worry too much about renaming anything just yet (i.e.: you can work off something called "Matts Bluest Theme Evar"), we'll fix all that before we go live...

## Now, how do I make it mine?

Let's kick on to the next step them: [Common Theme Settings][ph-part3].


[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part6]:   {% post_url 2016-10-17-Getting-started-with-Jekyll-Part-6 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}

[jekyll-qs]:    https://jekyllrb.com/docs/quickstart/
[jekyll-thm1]:  http://jekyllthemes.org/
[jekyll-thm2]:  http://themes.jekyllrc.org/
[jekyll-thm3]:  http://jekyllthemes.io/
[jekyll-wyot]:  https://jekyllrb.com/docs/themes/
[google-thms]:  https://www.google.com/search?q=jekyll+themes