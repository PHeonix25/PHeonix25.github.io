---
layout: post
title: "Listening to Steven Schuurman about Elastic"
date: 2016-11-08 00:00:00 +0000
categories: elastic-stack
published: true
image: img-ssvb
---

Tonight I got the opportunity to meet with [Steven Schuurman](https://twitter.com/stevenschuurman) from [Elastic](https://www.elastic.co/) - aka. the guys that created ELK/Elastic Stack. I wanted to take some notes for myself, and figurd I'd just turn them into a blog-post all about the latest Coolblue [#vrijbelijvers](https://twitter.com/hashtag/vrijblijvers) session!
<!--description-->

---

## *Super tof!*
Jazeker! Not only did he give us some great stories about the successes of Elastic Stack (all the way up to the reversioning of `v2`+`v3`+`v4` into `v5`) but I also took the opportunity to share a beer with him after the talk and learn about how Elastic works as a development-oriented company.

[![Steven Schuurman presenting at Coolblue #vrijblijvers][img-ssvb]][img-ssvb]

## Some background on my expectations
Firstly, I didn't expect the talk to be very technical, because although Steven is listed as a [Founder of Elastic Search](https://www.elastic.co/about/leadership) -- he is no [Shay Bannon](http://thedudeabides.com/). **That being said**, the way that Steven was able to deliver the story of Elastic - and growing a company from a team of 4 to a team of 400 - shows that he has had his finger on the (technical) pulse for the whole trip, and what a trip it must have been!

## Growing to 400...
Steven explained to us that growing (aggressively) to 400 people is no mean feat, but one of the things that surprised me the most was that he described how he (or Shay) has interviewed **EVERY. SINGLE. CANDIDATE**. This blew my mind for a few reasons, the first of which is that there are only so many hours in the week! Secondly, I've been involved in hiring a lot of people [here at Coolblue](http://www.careersatcoolblue.com/)[^1] and I don't even think I would have the patience and strength to interview thousands of people over 4 years to find 400 people that matched my desired "culture-fit" like he has.

However, thankfully, he made it clear that Elastic is a company that has employees in over 27 countries (*I hope I heard that right*), and that they have developers in every country they have employees -- which brings it almost to the same level of international representation here at Coolblue in IT. I can only hope that some of those interviews were "on-site" and he could take a nice break in an exotic location at that point in time.

## Releasing software at Elastic
Steven took the time to explain the way that Elastic delivers software in a very "agile fashion", and that they have teams that vary in size from 3 to 10 developers -- depending on what is needed. Each team is spear-headed by a Team Lead (i.e.: HR/soft-skills) **and** a Tech Lead (i.e.: technical vision), and those responsibilities don't (or rarely) overlap. 

Another interesting point of note was that the technical employees are **all** given the title of "Software Engineer"[^2] - even though some people have additional responsibilties, they are all working at the same level and that the teams would prefer to fall back on "time spent with Elastic", rather than development expertise when tough decisions have to be made about the product.

Personally, I truly wonder how that will pan out over time, but wish them the best of luck. In some ways it reminded me of the GitHub "No Managers, except Developers that are Managers" policies of years-past...

## Delivering value? 
Steven explained that previously there were a lot of teams working to their own cadence. In recent times though, they have sought to align the development teams with quarterly sessions to define a release and work towards it. For me, this is most visible in the restructuring of the versioning - whatever is ready will make it to `v6` (or `v5.1`?) and whatever is not, won't: *Simple, easy, clear*. 
 
As such, it seems that work at Elastic is spent less on "sprints" (and other ceremony), and more on "working towards a common goal", but Steven didn't get the chance to elaborate on this (or maybe each team does it independently) -- just some more food for thought.

## Team Independence?
Speaking of each team working independently, and having a lot of remote employees, it makes me wonder how the teams operate in a day-to-day manner. Steven (when we caught him at the bar after the talk) explained that they have worked hard at Elastic to ensure that each team delivers a product that is completely separate from the others. 

He used [Beats](https://www.elastic.co/products/beats) and [LogStash](https://www.elastic.co/products/logstash) as two examples - they rely on a common API (from the `core` team?) but work and (used to) deliver completely independently from one another. He didn't get the chance to explain how the team working on the core functionality operates (as I imagine they cannot work without interference or collaboration), but he did emphasise that they try and keep collaboration to a very VERY well defined set of expectations (API's, requirements, dates) and that it's turned out quite well for Elastic.

## Working Remotely?
While discussing working remotely, one of the most important things that Steven mentioned during his talk was that in order to maintain company culture (or even just to have a successful company) you need to have a team of people that **know**  each other, people that **understand** each other, and people that **empahise** with each other. He said there is no other way that he has found to do this without getting everyone into the same space at the same time (i.e.: company-wide events where everyone gets together). He also mentioned that *"email is **illegal**"* when talking about anything that could possibly become misconstrued, and implied that they rely on video-calling for quite a lot of their communications. 

## Personal takeaways
Personally, for me, the next step in this regard is to attend more #vrijblijvers events at Coolblue. Unfortunately, they aren't public, but this is the first one that I've had the chance to attend, and it was great. We've had quite some influential people present from some pretty cool companies, and knowing what I know now, it's a pity I missed out.

Secondly, I'm going to take a closer look at Elastic, the company, and obviously, also the Elastic Stack[^3] itself. Not just because Steven is a successful CEO of a Dutch company, experiencing similar growth to that of "Coolblue Tech", but also because I think there are some pretty cool lessons to be learnt -- similar to those that are known about GitHub, Buffer, Netflix, Spotify and other "transparent" companies. Achieving the level of growth that Elastic AND being succesful can't have been easy.

Finally, Steven, if this gets back to you at all, thanks again. It was a great session, and I was so happy we could host you (and share a beer). Proost!


[^1]: My face is still the placeholder image for some of the roles after all... 
[^2]: ...except the VP of Engineering, [Kevin Kluge](https://twitter.com/kevinkluge).
[^3]: I have a "Behind The Scenes" talk coming up in December about it after all.

[img-ssvb]: /assets/img/stevenschuurman_vrijblivers.jpg