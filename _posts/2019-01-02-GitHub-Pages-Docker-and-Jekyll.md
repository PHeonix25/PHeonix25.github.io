---
layout: post
title: "GitHub Pages, Docker, and Jekyll"
date: 2019-01-02 00:00:00 +0000
categories: github docker jekyll
published: false
---

It's been a while since I wrote about [setting up my blog for local testing](/2016/10/08/Getting-started-with-Jekyll-Part-4/) using [Docker](https://www.docker.com/) and Docker Toolbox, and the rest of the ecosystem has moved on. So it's time for an update...

<!--description-->

For those of you that followed along at the beginning, I wrote about how to set up your blog to [run locally](/2016/10/08/Getting-started-with-Jekyll-Part-4/), how to [run from GitHub Pages](/2016/10/22/Getting-started-with-Jekyll-Part-8/), and I even provided [BuildAndRun](https://github.com/PHeonix25/PHeonix25.github.io/blob/fd951c2fecfc9efc96792f8ac388ed680cf5936b/Docker.BuildAndRun.ps1) and [StopAndRemove](https://github.com/PHeonix25/PHeonix25.github.io/blob/fd951c2fecfc9efc96792f8ac388ed680cf5936b/Docker.StopAndRemove.ps1) scripts, but as I'm getting back into writing in 2019, and I wanted to update some parts of my site, those ... stopped working!

Keeping in mind I've changed laptops 3 times in the past few years, and have just been "pushing small changes to master" for about as long (_I know, I know_), today I spent far too long trying to work around the bugs I was experiencing in getting Jekyll running locally before I decided to step back and "read the docs".
I figured I'd type this up so that you - _and future me_ - don't have the same troubles I did today.

In this post, I'll step through the errors I experienced, and how I solved them, so let's get straight into it:

# Issues I experienced

<!-- TOC depthFrom:2 -->

- [Docker Hub credentials were invalid](#docker-hub-credentials-were-invalid)
- [Container "running", but no content returning from 0.0.0.0](#container-running-but-no-content-returning-from-0000)
- [Website rendered without CSS](#website-rendered-without-css)
- [Starefossen no longer up to date](#starefossen-no-longer-up-to-date)
- [Container not accepting updates](#container-not-accepting-updates)
- [Docker Compose command changed](#docker-compose-command-changed)

<!-- /TOC -->

## Docker Hub credentials were invalid

Log out, log in

## Container "running", but no content returning from 0.0.0.0

stupid firewall rules

## Website rendered without CSS

similar to the above

## Starefossen no longer up to date

yup, jekyll/jekyll:pages instead

## Container not accepting updates

`--watch` should be turned on by default when using `jekyll serve`, but wasn't for me.

Something else

## Docker Compose command changed

Something

# Takeaways!

- New Scripts!
- .
