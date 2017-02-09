---
layout: post
title: "Visual Studio Code and the inbuilt terminal"
date: 2016-11-01 00:00:00 +0000
categories: vscode
published: true
---

Did you know that there is an embedded terminal running within Visual Studio Code as of [May 2016][vs-may16]? I didn't!
<!--description-->
![2016-11-01-VSCode-and-the-terminal](/assets/headers/2016-11-01-VSCode-and-the-terminal.png)

## Wait, what?

Yeah, if you're like me, and you've been using VS Code for a while, but not really paying attention to the release notes, then you may have been greeted with a nice surprise when launching a new instance. Namely, this screen:

[![Whoa there, what's that terminal thing they mention?][img-vs-ls]][img-vs-ls]

See that bottom line? `Toggle Terminal`!? It turns out that there has been an integrated terminal in VS Code for quite some time, and it's pretty slick.

Using ``Ctrl+` `` now launches a perfectly reasonable `cmd` terminal (at least here, on Windows), which you can switch into a "more fully fledged console" by launching PowerShell:

[![Terminal wonderfulness][img-vs-tm]][img-vs-tm]

## Unlock PoshGit

As an added bonus, I have a `Set-Prompt` command which I've uploaded [over here][ph-setpmt] that I load into my `Microsoft.Powershell_profile.ps1` (in `~\Documents\WindowsPowerShell\`) so that I can call `Set-Prompt GitHub` and -- assuming you have PostGit installed on Windows -- have something like this:

[![Ooo, now with pretty colors][img-vs-pg]][img-vs-pg]

As a result now, when I'm blogging, there's no need to switch back and forth between a PowerShell window and VS Code, I can do it all from a single window:

[![Git prompts and Powershell in VS Code, yay!][img-vs-fw]][img-vs-fw]

There are plenty more supporting docs on this, [at the official site][vs-term], and there are plenty of options for modifying it as you see fit, so go nuts!

## Multiple instances?

You can launch multiple instances of the terminal, so why not set it up in another instance of the terminal and switch between them easily? By default the keybindings are not preset, but there's a simple solution to that: just add your own keybindings!

```json
/// Add this in your own keybindings.json 
/// Or just use Ctrl+Shif+P and type SHORTCUTS
[
    { 
        "key":      "ctrl+` n",      
        "command":  "workbench.action.terminal.focusNext",
        "when":     "terminalFocus" 
    },
    { 
        "key":      "ctrl+` p",
        "command":  "workbench.action.terminal.focusPrevious",
        "when":     "terminalFocus" 
    }
]
```

## What about Jekyll?

Great idea! Back in [Part 4][ph-part4] I showed you how to set up Jekyll in Docker, and because this is a command window, you can check Docker, or launch containers, or attach to running containers -- the sky is your limit!

## Keep an eye on those notes!

So that's all for now; one less reason to leave the Visual Studio Code window, and one more reason to keep an eye on the [Release Notes][vs-relnts] in the future!



[ph-part4]:  {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-setpmt]: https://github.com/PHeonix25/Powershell.Dockerscripts/blob/master/Profiles/Microsoft.Powershell_profile.ps1

[img-vs-ls]: /assets/img/vscode_launch_screen.png
[img-vs-tm]: /assets/img/vscode_terminal.png
[img-vs-pg]: /assets/img/vscode_setprompt.png
[img-vs-fw]: /assets/img/vscode_fullwindow.png

[vs-may16]:  https://code.visualstudio.com/updates/May_2016#_integrated-terminal
[vs-term]:   https://code.visualstudio.com/docs/editor/integrated-terminal
[vs-relnts]: https://code.visualstudio.com/updates/
