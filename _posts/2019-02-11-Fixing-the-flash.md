---
layout: post
title: "Fixing the flash"
date: 2019-02-11 00:00:00 +0000
categories: webdev front-end css
published: false
image: /assets/headers/2019-02-11-Fixing-the-flash.png
---

For a long time since I last re-designed this site, I've been suffering from "the flash", aka. [FOUC](https://en.wikipedia.org/wiki/FOUC), or _Flash of Unstyled Content_. I had no idea how to fix it, but today was the day that I decided to change that.

<!--description-->

![2019-02-11-Fixing-the-flash](/assets/headers/2019-02-11-Fixing-the-flash.png)


## What do you mean?

A flash is more irritating than destructive or harmful. I've managed to capture a very slow rendering of the site showing it off below:


## First line in your header

```html
<head>
    <style>html{visibility:hidden;opacity:0;}</style>
```

## Matching line as the last line in your CSS

```css
html {
    visibility: visible;
    opacity: 1;
}
```

## Git Commit

https://github.com/PHeonix25/PHeonix25.github.io/commit/98c320259904564406369f0389a7ee1544b0539f
