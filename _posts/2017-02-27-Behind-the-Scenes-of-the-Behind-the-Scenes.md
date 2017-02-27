---
layout: post
title: "Behind the Scenes of the 'Behind the Scenes'"
date: 2017-02-27 00:00:00 +0000
categories: presenting, talks
published: true
image: /assets/headers/2017-02-27-Behind-the-Scenes-of-the-'Behind-the-Scenes'.png
---

I thought it might be interesting to type up what I do to prepare for an event like the ["Behind the Scenes" at Coolblue][cb-bts] - to get you truly "behind the scenes" of the "Behind the Scenes" if you will.

<!--description-->
![2017-02-27-Behind-the-Scenes-of-the-'Behind-the-Scenes'](/assets/headers/2017-02-27-Behind-the-Scenes-of-the-'Behind-the-Scenes'.png)

# The background

In case you've never attended one of our events, the "Behind the Scenes" nights at Coolblue are all about showing off some of the stuff that we're doing (or struggling with) internally - and this is for a few reasons:

- You might have the same challenges in your workplace - we are just another dev team after all
- You might be interested in "how we do things" - even if they are better, worse, or different
- We might want to show some stuff off - if it's new, or we're proud of an internal achievment
- We want to show you our office, and convince you that you want to join us

Now normally, this event is organised by the Recruitment department (in the name of getting interesting people in the door to check out the office), but don't turn off just yet! It wouldn't happen if we didn't match the criteria above; if the developers didn't want to talk, we wouldn't force the event, and to be honest, if you've been to one of these events, you know that Coolblue is no hard sell - our office is pretty awesome after all - and hopefully you feel the people (that you're coming to listen to) are worthwhile too!

# The preparation

It all starts with the decision of when and who - **when** should we host the session and **who** should talk? These are the two big questions that we need to answer up front.

As a result, the .Net recruitment guys will normally start the conversation by asking the Leads and Pathfinders if there is anyone willing to talk about anything interesting. I regularly shoot my hand up to speak at these events because I find them quite enjoyable, and often it's comfortable knowing that you'll be presenting on "your home turf". It's also a great chance to improve my public speaking (and improvisation) skills and help other people within the company that want to also get better at presenting. So it's a decent win all around as far as I am concerned!

We'll also do some rudimentary checking for dates that look good (and aren't overlapping other local meetups/conferences and also work for the presenters) and give them back to Recruitment - keeping in mind this normally done about three months out from the night itself - so it can be pretty easy to find a space that works for everyone. :)

# The discussion

After we've figured out when we can host the event, and who should talk, the next step is finding a decent topic, and maybe setting a "theme" for the evening. Previously, we've had "failure nights", and "CI/CD at Coolblue", where both speakers will talk about different angles of the same topic, but there are also evenings (like [the last one][bts-feb17]) where Nathan and I found a way to relate to each other (_as "that bloody Kiwi & the stupid Aussie"_) but spoke about completely separate topics: Nathan about the Mikado method, and me about how we use the Elastic Stack as .NET developers.

It's normally at this point that we have to give the Recruiters a high level summary for the [BtS page][cb-bts] and a opening statement for the website - and this is often six weeks to two months out from the actual event itself.

# The research

So now we have our speakers, and our topics, and a general theme - so we need to get to it and start work on the presentations!

At this point, it's not uncommon for us to reach around the organisation and find people that can help us straighten out the facts for whatever we're trying to implement. As an example of [the Elastic Stack-based presentation I gave in Feb 2017][bts-slides], I spent some time talking with [Matt Hodgkins][matthodge] as head of the "back-office deployment" team about what I could (and occasionally, couldn't) say and how much information I could give away during the demo's and presentations.

For me, I quite enjoy delivering live demos (it really gets my blood pumping), and so it's about this time that I sit down with a Markdown document (like [this one][bts-readme]) and start fleshing out the structure of the talk and which parts would be interesting to demonstrate to the audience. I also try and figure out which technologies that I'll need to work with and make sure that I understand their quirks - _I'm looking at you 'Docker for Windows' and your OS-switching support..._

At this point it's also quite common to spend some time with the other presenter (_if you both have time_) to go over what you're going to say, and to make sure there aren't any overlaps (if you're sharing a topic) or that there aren't any ... general disagreements about anything that either of you want to say on the night. You'll also figure out the order, and if you need or want any additional support or assistance from each other. In the instance of the latest event, Nathan hadn't presented at Coolblue before - and would have greatly benefitted by a write-up like this - and didn't know much about the Coolblue "huisstijl", the way that we should present our slides, so I could help him out with that.

It's normally about this time that I start a repository and start publicly committing all my research and resources that I'll need for the talk. This helps me to get my thoughts straight, and I can use GitHub (and a combination of Markdown, PowerShell & Google Sheets) to keep it all lined up nicely. You can see an example of this when you look at my latest talk's commit history [over here][bts-commits].

# The talk (and the dry runs!)

At about a month out from the event, we'll start holding "Dry Runs" for our colleagues to ~~suffer through~~enjoy. This gives us an opportunity to ensure that things go to plan, and that we're on track for the talk itself - our presentations are solid (although mostly without the "Coolblue style") and we've got a good run for the night. This is also an opportunity for our colleagues to learn about the topic (in case they haven't seen it yet) and to give us valuable feedback about what we missed, or maybe even where we blathered on too much.

For most nights that I've been a part of, I like to organise two of these. One held three weeks out from the night, and another one week out from the actual event. This gives me time to address any feedback that is raised internally, and make sure that I (_appear to_) know what I'm talking about.

By this stage, at about a week out from the event, we'll normally have a good indication from the recruitment team about the expected numbers on the night (it's normally between 80 to 100 people + a few colleagues) so it's good to wrap your brain around that number, and this is the last chance to reschedule the evening, like if the numbers aren't good enough, or the speakers aren't ready.

# The night

For the actual night itself, the Recruitment team, and the Events team will kick off with all the setup of the room (and organisation of the space, and the meals, and the entry tickets) from about 3pm and the presenters will normally just double-check their technical requirements (set up the laptop and double check the mics) from about 4 or 5pm.

In the case of technical issues (like at the latest event, where the HDMI port on my laptop decided not to work) this gives you about an hour to figure out what you're going to do before there are people eating in the room. One lession I've recently learnt is to make sure that you hold AT LEAST ONE of the "dry runs" in the actual location that the event is going to take place! Nothing beats triple-checking the real thing and being prepared!

From here on out, we allow the audience in at about 6pm, feed them and allow them to mingle for about an hour and then kick off with an introduction from a Coolblue representative (who will typically tell you a little bit more about Coolblue itself) and then the first presentation, a short break, and then the second presentation and a tour of the building - all culminating in a well-deserved drink at the company bar!

# Any suggestions for improvement?

I hope that this little write-up gives you some additional insight into what it takes to keep these events running, and I hope that I can see you at one of them! If nothing else, hopefully this will help my fellow colleagues in knowing what to expect when it comes to presenting at one of our [Behind the Scenes][cb-bts] nights. If anyone has any suggestions (or anything I missed), hit me up in the comments below, or get in touch on [Twitter](https://twitter.com/{{ site.twitter_username }}).

If you're interested in what the end-result is (in terms of "assets" from a talk like this), feel free to have a look at my latest talk by [snooping around the repository][bts-repo], and checking out [the slides over on SlideShare][bts-slides]. Cheers!

[cb-bts]:       https://www.coolblue.nl/behindthescenes
[bts-feb17]:    https://www.coolblue.nl/behindthescenes2102
[bts-repo]:     https://github.com/phermens-coolblue/bts-2017-february/
[bts-commits]:  https://github.com/phermens-coolblue/bts-2017-february/commits/master
[bts-readme]:   https://github.com/phermens-coolblue/bts-2017-february/blob/master/README.md
[bts-slides]:   https://www.slideshare.net/PHeonix25/behind-the-scenes-at-coolblue-feb-2017
[matthodge]:    https://hodgkins.io/
