---
layout: post
title: "Making fgitvis"
date: 2017-05-20 00:00:00 +0000
categories: fsharp git github charting
published: true
image: /assets/headers/2017-05-20-Making-fgitvis.png
---

I thought it might be interesting to outline where my latest GitHub project [`fgitvis`][fgitvis] came from and what my intent is to make it easy for other people to contribute.

<!--description-->
![2017-05-20-Making-fgitvis](/assets/headers/2017-05-20-Making-fgitvis.png)

# Everything has a back-story

At work, I've been talking with my colleague [Devon][dburriss] about life, F#, being an expat in the Netherlands, Git, GitHub, and improving ourselves (and our colleagues). By now I'm sure that's all the story you need, but...

We thought it would be interesting to work on a F# type provider for Git repositories (not just ones hosted on GitHub), both so that you could dive through the history of a Git repository, but also to check out active contributors, commit patterns, anything really... We thought it would be cool to basically create a local copy of the [Pulse page][pulse] of your repositories on GitHub.

# What problem are we solving?

Granted, this isn't immediately apparent -- especially considering the state of the code-base as it stands today!

Some people are naturally a little more ... "prolific" than others, both in life and in Git discipline. We've all had a colleague that always seems to commit 100+ files (in a single commit?) at 4:30 on a Friday. Hopefully, we've also had the opportunity to work with "that Git guy" that breaks everything apart properly, puts it all in the right order, constantly `rebase`s everything so there's a perfectly clean story showing the progress of work over the course of a task or deliverable and always seems to be right on the ball.

... but what about the rest of us? All the people in-between somewhere. We make commits, but sometimes they are too big (or god-forbid there's an `AND` in the commit message), or they are in the wrong order, or they have merge commits scattered through the whole story. We commit early and often, but don't "sync" regularly enough; in short, we're trying, but we could do better!

At work (and in life) I have a policy of trying to measure something before you work on improving it. You can see this as `red-green-refactor`, or as `"knowing is half the battle"`, but either way, I always try to base my decisions off real, living, data. Numbers, trend graphs, dashboards; anything but anecdotes and personal prejudices - of which I have plenty!

In order to track down how and where we can improve our Git/GitHub processes, we should first see what things we are doing that could be a SIGN that something is amiss: radio-silence in the week and then too many commits on a Friday; regularly checking in files after midnight; or even just always committing the same two files. All these things (and many more) might be signs that we should be a bit more disciplined, or that we (or someone else) needs a hand.

# OK, so why F#?

I've been a big fan of F# for quite some time. My first public commit to GitHub was [in 2015][yfskoans] completing some of the awesome [F# Koans][fskoans] -- which in my opinion is a great way to jump right in in!

Recently, there seems to be a bit of a "resurgence" of sorts. A lot more people around me are talking about it and there's been a whole lot more interest at local user-groups and it's momentum is [continuing at Build][fsch9vid].

Devon and I were talking about the "magic" of type-providers after watching [this video][fsch9vid] and seeing him step through the Wikipedia article on Presidents - I won't spoil it, but you should watch it!

I wanted to dive back in, and figured this would be a fun, relatively simple exercise, so... why not?

I also wanted to spend some more time working on improving my F# skills, especially in relation to making scalable, well-tested, well-architected solution structures. This is not one of them (yet), but every commit counts, right?

# How can I contribute?

Great question, and we'd love some help if you think that this is worthwhile for you, please feel free to jump in and make some PR's!

Possible candidates for submission are things like:
- Adding unit tests!
- Adding methods to the `GitOperations` module to return more `seq<string * int>`'s
- Adding methods to the `ChartBuilders` module to return more `GenericChart`'s
- Redesigning the architecture. I'm no F# pro (yet?) and so I know there are ways that this could be better laid out and more "functional" in design...

Hopefully this explains some of the reasons that Devon and myself had when we were thinking about the solution, and we should continue to work on this so that we can make it into the tool that we want it to be :)

[fgitvis]:      https://github.com/PHeonix25/fgitvis
[dburriss]:     http://devonburriss.me/
[pulse]:        https://github.com/PHeonix25/fgitvis/pulse
[myfskoans]:      https://github.com/PHeonix25/FSharpKoans/commit/1402a181439f6e1e6188372418b93e9d2bb5b8c9
[fskoans]:      https://github.com/ChrisMarinos/FSharpKoans
[fsch9vid]:     https://channel9.msdn.com/events/Build/2017/T6064