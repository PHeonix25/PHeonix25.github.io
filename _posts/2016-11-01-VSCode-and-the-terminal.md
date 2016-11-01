---
layout: post
title: "Visual Studio Code and the inbuilt terminal"
date: 2016-11-01 00:00:00 +0000
categories: vscode
published: false
---

Did you know that there is an embedded terminal running within Visual Studio Code as of [May 2016][vs-may16]? I didn't!
<!--description-->

## Wait, what?

Yeah, if you're like me, and you've been using VS Code for a while, but not really paying attention to the release notes, then you may have been greeted with a nice surprise when launching the latest version. Namely, this screen:

![Whoa there, what's that terminal thing they mention?](/assets/img/script-all-the-things.jpg)

It turns out that there has been an integrated terminal in VS Code for quite some time, and it's pretty slick.

Using ``Ctrl+` `` now launches a perfectly reasonable `cmd` terminal (at least here, on Windows), which you can switch into a "more fully fledged console" by launching PowerShell:

![Terminal wonderfulness](/assets/img/something.jpg)

## Unlock PoshGit

As an added bonus, I have a `Set-Prompt` command which I've uploaded [over here][ph-setpmt] that I load into my `%PATH%` so that I can call `Set-Prompt GitHub` and have something like this:

![Ooo, now with pretty colors](/assets/img/something.jpg)

As a result now, when I'm blogging, there's no need to switch back and forth between a PowerShell window and VS Code, I can do it all from a single window:

![Git prompts and Powershell in VS Code, yay!](/assets/img/something.jpg)

There are plenty more supporting docs on this, [at the official site][vs-term], and there are plenty of options for modifying it as you see fit, so go nuts!

## Multiple instances?

You can launch multiple instances of the terminal, so why not set it up in another instance of the terminal and switch between them easily? By default the keybindings are not preset, but there's a simple solution to that: just add your own keybindings!

```json
/// Add this in your own keybindings.json 
/// Or just use Ctrl+Shif+P and type SHORTCUTS
[
    { 
        "key":      "ctrl+n",      
        "command":  "workbench.action.terminal.focusNext",
        "when":     "terminalFocus" 
    },
    { 
        "key":      "ctrl+p",
        "command":  "workbench.action.terminal.focusPrevious",
        "when":     "terminalFocus" 
    }
]
```

## What about Jekyll?

Great idea! Back in [Part 4][ph-part4] I showed you how to set up Jekyll in Docker, and because this is a command window, you can check Docker, or launch containers, or attach to running containers -- the sky is your limit!

For me, this means that this post looks something like this:

![Yeah, this is what blogging looks like for me](/assets/img/something.jpg)

So that's all for now; one less reason to leave the Visual Studio Code window...



[ph-part4]:  {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-setpmt]: http://TBA

[vs-may16]:  https://code.visualstudio.com/updates/May_2016#_integrated-terminal
[vs-term]:   https://code.visualstudio.com/docs/editor/integrated-terminal