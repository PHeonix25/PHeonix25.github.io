---
layout: post
title: "Getting Started with Jekyll - Setting the Scene"
date: 2016-10-01 00:00:00 +0000
published: true
---

In this series (of about 8 short posts) I want to outline the steps that you need to take to get started with Jekyll, writing your first post, previewing it via Docker, and "taking care of hosting" with GitHub Pages.
<!--description-->

1. Getting Started with Jekyll - Setting the Scene **<==**
2. [Getting Started with Jekyll - Finding a Theme]({% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %})
3. [Getting Started with Jekyll - Common Theme Settings]({% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %})
4. [Getting Started with Jekyll - Modifying Templates]({% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %})
5. Getting Started with Jekyll - Setting up Jekyll in Docker
6. Getting Started with Jekyll - Learning Markdown and Liquid
7. Getting Started with Jekyll - Transitioning Content
8. Getting Started with Jekyll - Launching your Site

## What is Jekyll?

For those of you that don't know (or landed here by mistake) [Jekyll][jekyll] is a "blog-aware, static site generator" written in Ruby. To shamelessly steal a quote from their [Documentation][jekyll-docs]:

> Jekyll is, at its core, a text transformation engine. The concept behind the system is this: you give it text written in your favorite markup language, be that Markdown, Textile, or just plain HTML, and it churns that through a layout or a series of layout files. Throughout that process you can tweak how you want the site URLs to look, what data gets displayed in the layout, and more. This is all done through editing text files; the static web site is the final product.

What this means for us is that we can write our stuff in Markdown, add a template for the HTML "framing" of our content, run it through Jekyll as a post-processor and a whole bunch of static pages pop out the other side. For me personally this also means that I don't need to worry about Drupal/WordPress/Joomla updates, or running a DB for a single "contact me" page any more - nothing is injectable; there are no more moving parts after publication (excluding any JS used in the theme) and this makes me (*and my hosting provider*) very happy!

What's even better is that Jekyll is [open-source][jekyll-gh], has an active user-base which seems to be very supportive [and active][jekyll-ghi], and has clearly defined and well-documented code. Even if you don't understand Ruby, you can probably track down the source of any issues just by following along on GitHub or cloning the repo into your own editor. This is a breath of fresh air for me, because if we're being honest with each other, trying to track down issues in WordPress (or maybe even just PHP in general...) is a horrible experience without the right tooling.

## Why Jekyll?

Personally, I've tried to set up a few blogs over the last 10 or so years, but nothing ever stuck. It was always too much of a hassle to keep it updated, make sure that it's working correctly, and that the theme is current but not over done. I also worried about hosting it myself and getting Slashdotted (*is that still a thing?*) which, lets face it, was never a problem when I wasn't writing much anyway. Setting up Drupal and operating a whole CMS just for a few lousy posts didn't seem right to me so I migrated everything out into WordPress (which was hard enough) only to realise that I'd swapped one CMS for another. *Yes, I know, the whole "database to run a website" should have given it away.*

Jekyll is not like that. I have flat files (written with Markdown), sitting in a directory, run a post-processor over them and a complete, static site pops out the other side ready for upload on my server. Sounds great, but if it's just static files, surely there are better places to hold static files - which is where GitHub (specifically [GitHub Pages][github-pages]) comes in. Another advantage of using GitHub Pages is that, given the flat Markdown files, **they can do all this for me** - and for free! They'll grab my files, build it by pushing them through Jekyll and push it live and then host the output. No more updates, no more worrying about DDOS, **and** it'll mean that my contributions can just be `git push`-ed to " my site". Win-Win-Win!

Lets be honest, there's also the pride of running a nicely designed site and the possibility I'll learn something new (maybe even *gasp*, Ruby) certainly increases it's "nerd appeal" for me personally. Themes for Jekyll are also [very][jekyll-thm1], [widely][jekyll-thm2], [available][jekyll-thm3], and are normally very clean and modern looking, relatively easy to make (if you so choose), and above all else - simple.

## Why Docker?

Now, even though GitHub is going to do all that for me, I know I will want to preview my content locally first, and getting Jekyll up and running on Windows is no easy feat; I've never had much luck with Ruby or Python running on Windows - and so this is where [Docker][docker] comes in! If you're running on a Mac, or Linux, then this part won't be as applicable for you, but I think it might be worth your while to set it up this way anyway. Keeping environment variables and library installations scoped to a single running process is quite nice! I'll go into much more detail when we get to that step, but for now, I want to shout out to [Hans Kristian Flaatten][starefossen] whose [Docker image][docker-img] we will be using later. This whole process wouldn't be anywhere near as easy on Windows without that Docker image.

## Why Markdown?

As I wrote above, Jekyll is a post-processor that runs over flat files written in Markdown, Textile, or HTML - so why use Markdown? 

In my daily job, it's quite common for me to be writing Markdown documents for GitHub repositories or internal reference documents. Using Markdown as a "text format" for my blog then was an easy win for productivity. I don't need to re-learn new formatting tips and tricks, it's quite powerful and yet very succinct, and the familiarity works well for me. If you're not familiar with Markdown formatting, I'll write a separate post to give you some hints and tips later but for now if you're familiar with Textile, or you'd prefer to write your posts in plain old HTML, just know that they will also work for setting up your site with Jekyll.

## Let's get started!

I think that's enough explanation (and links) for now, why don't we [continue with finding a theme]({% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %})?


[jekyll]:       https://jekyllrb.com/
[jekyll-docs]:  https://jekyllrb.com/docs/home/
[jekyll-gh]:    https://github.com/jekyll/jekyll/
[jekyll-ghi]:   https://github.com/jekyll/jekyll/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20comments%3A%3E15
[docker]:       https://docs.docker.com/docker-for-windows/
[starefossen]:  https://github.com/Starefossen/
[docker-img]:   https://github.com/Starefossen/docker-github-pages
[github-pages]: https://pages.github.com/
[jekyll-thm1]:  http://jekyllthemes.org/
[jekyll-thm2]:  http://themes.jekyllrc.org/
[jekyll-thm3]:  http://jekyllthemes.io/