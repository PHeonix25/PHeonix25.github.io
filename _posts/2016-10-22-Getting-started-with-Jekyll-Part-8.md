---
layout: post
title: "Getting Started with Jekyll - Launching your site"
date: 2016-10-22 00:00:00 +0000
categories: jekyll github
published: true
modified: 2016-10-30
---

In this post - we're going to push our site live!
<!--description-->
![2016-10-22-Getting-started-with-Jekyll-Part-8](/assets/headers/2016-10-22-Getting-started-with-Jekyll-Part-8.png)

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme][ph-part2]
3. [Getting Started with Jekyll - Common Theme Settings][ph-part3]
4. [Getting Started with Jekyll - Setting up Jekyll in Docker][ph-part4]
5. [Getting Started with Jekyll - Learning Markdown and Liquid][ph-part5]
6. [Getting Started with Jekyll - Modifying Templates][ph-part6]
7. [Getting Started with Jekyll - Transitioning Content][ph-part7]
8. Getting Started with Jekyll - Launching your Site  **<==**

## Lets cover off a few assumptions first.

By now I'm assuming that you have a site live (on your local/or in Docker), and that you're happy with it. I'm also assuming that you understand `git` (at least as much as `git push` and `git pull`), and that if you want to set your site up on a custom domain that you've bought that domain and will have no trouble setting DNS records. I'm also assuming that you have a GitHub account, and want to host your site using GitHub Pages.

## Cool, so how do I configure my repo?

First of all (if you haven't already) you're going to need to make a repo on GitHub that matches your username like so: `<username>.github.io`. For example; mine is `pheonix25.github.io` because my GitHub username is `PHeonix25`.

Make sure, when you're setting this repo up, that you make it public, and you initialise it with a README - that's it. GitHub takes care of the rest in the background - it's a perfect example of convention over configuration!

## So it's configured, but what do I do with my content?

This one is easy - just open PowerShell in your local version of your site and `git push` your site like so:

```powershell
# Add the remote repository
git remote add origin git@github.com:<username>/<username>.github.io.git
# Push our content up!
git push -u origin master
```

**It truly is that simple!** 

------

## Let's talk about domains...

First of all, if you are happy with `<username>.github.io`, then you're done, you can skip down to [How will I know if my build fails](#how-will-i-know-if-my-build-fails) if you want to read about what happens when things don't go right, but for now, maybe just go outside and enjoy the rest of your day. :)

## Yeah, nah, I want a custom domain.

If you want a custom domain, it's not hard, but it does require some configuration. 

First of all, I would expect you to buy your domain from somewhere notable - maybe a provider that your friends can refer you to? 
For what it's worth, I've put a few of my latest sites on [SiteGround][siteground] and I have been very happy with their service, but I strongly recommend that you find one that works for you. 

> Just please, if I ask one thing, please avoid GoDaddy - _[this post][godaddy] is the latest one I was able to find, but Google is your friend..._

Once you have your custom domain name, you'll need to configure it, and the best guide is [the one from GitHub itself][github-setup]. It steps you through every scenario in plain English, and they even have a few different guides depending on the capabilities of your provider, so it's a great piece of documentation!  

## How about HTTPS/SSL?

If you're planning on using the default `<username>.github.io`, then there's nothing else to worry about. GitHub will take care of this one for you.

If you want to add HTTPS on a custom domain, then you will probably also want to get a [CloudFlare][cloudflr-su] account before we go much futher. [CloudFlare][cloudflare]'s free account provides you with what they call "Universal SSL" (_which is similar to the "HTTPS Everywhere" mission_) so that you can secure your site for free.

Once you've made your CloudFlare account, they have [a great blog post][cloudflr-ssl] on exactly how to do this step-by-step, but we can start at [Step 2][cloudflr-ssl] - because we already have our GitHub repo configured.

## How will I know if my build fails?

It should be noted that GitHub has [great documentation][github-docs] and support for GitHub Pages & Jekyll. Hopefully you can take the error that they will email you and check that site for the answer (if it's not clear enough from the verbose error message)

## What should I do now?

<iframe src="//giphy.com/embed/W3nBUAB1Csx7G?html5=true" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

> _Party like it's 1999?_ 

Hopefully after following the guides from [GitHub][github-setup] and [CloudFlare][cloudflr-ssl] you have a site that's up and running, using HTTPS (like a good web citizen) and it's all for free. 

**We're done! Go forth and create content.** Enjoy posting your content [using Markdown and Liquid][ph-part5] - or continuing to if you've [migrated all your existing stuff][ph-part7]. 

 
[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part6]:   {% post_url 2016-10-17-Getting-started-with-Jekyll-Part-6 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}
[ph-part8]:   {% post_url 2016-10-22-Getting-started-with-Jekyll-Part-8 %}

[cloudflare]:   https;//www.cloudflare.com
[cloudflr-su]:  https://www.cloudflare.com/a/sign-up
[siteground]:   https://www.siteground.com/go/hermens
[godaddy]:      https://solvid.co.uk/7-reasons-to-avoid-godaddy 
[github-setup]: https://help.github.com/articles/quick-start-setting-up-a-custom-domain/
[cloudflr-ssl]: https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/#step2settingupourdns
[github-docs]:  https://help.github.com/categories/customizing-github-pages/
