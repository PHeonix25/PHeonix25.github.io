---
layout: post
title: "GitHub Pages, Docker, and Jekyll"
date: 2019-01-17 00:00:00 +0000
categories: github docker jekyll
published: true
image: /assets/headers/2019-01-17-GitHub-Pages-Docker-and-Jekyll.png
---

It's been a while since I wrote about [setting up my blog for local testing](/2016/10/08/Getting-started-with-Jekyll-Part-4/) using [Docker](https://www.docker.com/) and Docker Toolbox, and the rest of the ecosystem has moved on. So it's time for an update...

<!--description-->
![2019-01-17-GitHub-Pages-Docker-and-Jekyll](/assets/headers/2019-01-17-GitHub-Pages-Docker-and-Jekyll.png)

For those of you that followed along at the beginning, I wrote about how to set up your blog to [run locally](/2016/10/08/Getting-started-with-Jekyll-Part-4/), how to [run from GitHub Pages](/2016/10/22/Getting-started-with-Jekyll-Part-8/), and I even provided [BuildAndRun](https://github.com/PHeonix25/PHeonix25.github.io/blob/fd951c2fecfc9efc96792f8ac388ed680cf5936b/Docker.BuildAndRun.ps1) and [StopAndRemove](https://github.com/PHeonix25/PHeonix25.github.io/blob/fd951c2fecfc9efc96792f8ac388ed680cf5936b/Docker.StopAndRemove.ps1) scripts, but as I'm getting back into writing in 2019, and I wanted to update some parts of my site, those ... stopped working!

Keeping in mind I've changed laptops 3 times in the past few years, and have just been "pushing small changes to master" (aka. lazy trunk-based development) for about as long (_I know, I know_), so today I spent far too much time trying to work around the bugs I was experiencing in getting Jekyll running locally before I decided to step back and "read the docs".

I figured I'd type this up so that you - _and future me_ - don't have the same troubles I did today. In this post, I'll step through the errors I experienced, and how I solved them., Let's get straight into it:

# Issues I experienced

<!-- TOC depthFrom:2 -->

- [Docker Hub credentials were invalid](#docker-hub-credentials-were-invalid)
- [Docker Compose command changed](#docker-compose-command-changed)
- [Container "running", but no content returning from 0.0.0.0](#container-running-but-no-content-returning-from-0000)
- [Website rendered without CSS](#website-rendered-without-css)
- [Starefossen no longer up to date](#starefossen-no-longer-up-to-date)
- [Container not accepting updates](#container-not-accepting-updates)

<!-- /TOC -->

## Docker Hub credentials were invalid

My Docker script (note, not Docker Compose) refused to find images, and even though my Docker icon in the notification area showed me as "logged in", it wouldn't locate any images because "my credentials for Docker Hub were invalid". I went to [hub.docker.com](https://hub.docker.com) and confirmed that my credentials that were saved had not been changed, and everything looked fine locally.

Thankfully the solution was quite simple: Right click on the Docker icon in the Windows notification area, and choose "Sign out". Wait for it to finish logging you out and then sign in again.

![Even though it looks fine, sign out to refresh the credentials](/assets/img/docker-signout.png)

Simple, right? Unfortunately, I lost about half an hour to this because everything "looked right", but the credentials had expired in the background.

## Docker Compose command changed

Previously, I was using raw Docker commands, [like this, in a Dockerfile](https://github.com/PHeonix25/PHeonix25.github.io/blob/65c0e178f8056ba5caaeb7421334769838f7e888/Dockerfile) to get the site up and running. I even tried out a `docker-compose.yml` [years ago](https://github.com/PHeonix25/PHeonix25.github.io/blob/368f8e55827dd4c1c2de8f6b950c6d9dd397fece/docker-compose.yml) and... that worked back then, but like I said in the intro, the community has moved on. It was time to get with the cool new kid in town: Docker Compose 2.0 (or 2.1, or 3.0), but a lot of the syntax has changed.

You can see the changes I needed to make in [this diff](https://github.com/PHeonix25/PHeonix25.github.io/commit/bd24ad1bcab071545105ff9bc23fde34aded3362#diff-4e5e90c6228fd48698d074241c2ba760) that I pushed once I'd solved all the problems below.

## Container "running", but no content returning from 0.0.0.0

Great, so now we have our container up and running, and we can watch Jekyll recompile the pages on the command line as we're making changes... but we go to http://0.0.0.0:4000 and ... nothing! Weird, the config looks fine, and this did work before. Changing it from using the `ANY` IP (0.0.0.0) to `localhost` or the loopback IP (127.0.0.1) did nothing different. Nothing was servicing those IP/Port combinations.

Now this is nothing new, there has been a limitation on [Windows networking + Docker](https://blog.sixeyed.com/published-ports-on-windows-containers-dont-do-loopback/) for a long time, but my scripts were aware of this, and we were using the right IP for the specific container up until we moved to Windows version 1809, and now "it should just work", but it didn't.

> NOTE: If you're using a Windows version LESS THAN 1809, you can follow the steps [in this StackOverflow answer](https://stackoverflow.com/questions/47010047/localhost-not-working-docker-windows-10/47011886#47011886).

After a long time, I had realised that this laptop had recently been re-configured, and the Windows firewall was blocking this as "outbound traffic". After recategorising [my WiFi network to Private](https://support.microsoft.com/en-us/help/4043043/windows-10-make-network-public-private), everything "just worked" as expected.

## Website rendered without CSS

Jekyll, when it starts, looks for the configured `host:port/baseurl` structure by lifting that out of `_config.yml`, and uses this combination when rendering URLS for the site - including CSS & Javascript files. My configuration was set to use `http://hermens.com.au` as `site.url`, but no `HOST` was specified.

The solution for me was to use configuration overloading in the Docker Compose command: `jekyll serve --config  _config.yml,_config.docker.yml`, which [according to the docs](https://jekyllrb.com/docs/configuration/environments/) mean that any values that match in later files will replace earlier files. Adding the `_config.docker.yml` and overriding the `url` value to `http://localhost:4000` fixed this for me.

Since I've been looking into it though, this is NOT the suggested way to do this, and instead I should be setting the [site.host and site.port values](https://jekyllrb.com/docs/configuration/options/#serve-command-options) for use when debugging locally. Looks like I still have an outstanding change to make here :)

## Starefossen no longer up to date

For a long time, I advised people to use the latest image from [Starefossen](https://github.com/Starefossen/docker-github-pages), but this is now a bit out of date. To get a better experience locally with Jekyll, it's advised to use the official [jekyll/jekyll:pages](https://github.com/envygeeks/jekyll-docker) instead. I don't think there's anything _wrong_, per-se with the Starefossen image, it's just that it's not actively updated in the same way that the official Jekyll images are.

## Container not accepting updates

This was a fun one. After I changed from Starefossen to Jekyll docker images, my files weren't being watched.
Everything was running, but the build wasn't recompiling pages.

According to [the documentation](https://jekyllrb.com/docs/step-by-step/01-setup/#build) `--watch` should be enabled by default when using `jekyll serve`, but wasn't for me... I needed to manually add `--watch` and `--force_polling` to the Docker Compose command, so it became even longer: `jekyll serve --force_polling --watch --config  _config.yml,_config.docker.yml`. Quite a mouthful by now.

# Results!

I have a bunch of new/updated scripts & config to run everything locally for me:

- `Docker.BuildAndRun.ps1` and `Docker.StopAndRemove.ps1` - the [diff is here](https://github.com/PHeonix25/PHeonix25.github.io/commit/04fccfac9fc1461bb2e6638418a569823420269d#diff-68d5e20a6c7789c1049261ed6760be99).
- `docker-compose.yml` [was updated](https://github.com/PHeonix25/PHeonix25.github.io/commit/bd24ad1bcab071545105ff9bc23fde34aded3362#diff-4e5e90c6228fd48698d074241c2ba760).
- `_config.yml` was expanded & is overridden by `_config.docker.yml` that matches the `JEKYLL_ENV` environment variable.
- ...and the old `dockerfile` can now be removed.

As an added bonus, thanks to these upgrades, I can now just do `docker-compose up` and `docker-compose down` if I wish!

I hope this helps you as much as it will help future me :) Cheers.
