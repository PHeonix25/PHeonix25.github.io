---
title: "The Step Got Faster. The Work Didn't."
description: "AI made our engineers measurably faster at the bit it touched. The business barely noticed. Here's what we learned about the structure around the work, and why it matters more than the tools."
pubDate: 2026-12-01
category: Engineering
tags: ["AI-PDLC", "engineering leadership", "flow", "metrics", "agentic"]
series: "From metrics to agents"
seriesPart: 2
draft: true
---

Back in July I wrote about [the metrics that matter in an AI-accelerated product development lifecycle](/LINK-TO-JULY-POST). It was a tidy post. Lots of sensible advice about measuring outcomes instead of activity.

Since then I've spent the better part of a year actually *applying* that advice, with real teams, in a large and long-established enterprise. Not a startup. Not a greenfield demo. Teams with history, mainframes, change boards and twenty-year-old release processes.

So this is the sequel. Less "here's what you should measure", more "here's what happened when we did".

Spoiler: the numbers were great, right up until they weren't.

## The good news that wasn't

We started where almost everyone starts: put AI tools in the hands of engineers and see if the build gets faster.

Two delivery teams, five sprints, three measures agreed up front: velocity, scaffolding time (from a story going *In Progress* to the first meaningful commit), and rework (commits after the first implementation of a story).

Scaffolding time fell by **71%** in one team and **89%** in the other.

If I'd stopped there, I'd have had a cracking LinkedIn post. 🚀

But velocity in the first team went from 29 points a sprint to 12. The second team went from 62 to 76. Rework improved from 2.5 to 1.0 in one team, and went from 0 to 3.0 in the other.

So: the step AI touched got dramatically faster. The work, as a whole, didn't reliably go anywhere. /facepalm

To be fair to everyone involved, it was a short window, the two teams were set up very differently, tooling arrived at different times, and nobody had much protected time to learn. But that's kind of the point. *Those things are the system.* And the system ate the gain.

## So we moved upstream

Fine, we thought. If the build isn't the bottleneck, maybe it's the bit before the build. Next we tried AI in requirements shaping: helping teams turn intent into well-formed, development-ready stories.

The signal was genuinely useful. Two teams saw cycle time per story drop by **17%** and **38%** (small samples, so salt to taste).

But adoption was the ceiling. At best, **29%** of stories were AI-created, against a target of 60 to 80%. A tool that people use on less than a third of the work can only ever move less than a third of the outcome.

## Then we followed a single ticket

The third engagement was the one that changed how I think about all of this. Instead of asking "does AI make step X faster?", we asked a much more boring question: *where does the time actually go?*

We baselined a cross-functional squad covering design, content, QA and build. On average, a content ticket took **36.9 days**. Of those, **27.7 days** were spent waiting. Not being worked on. Waiting. For approvals, for hand-offs, for environments, for someone else's queue.

That's three quarters of the elapsed time sitting in places no coding assistant will ever reach.

You can make the working time infinitely fast and you'll still have a 27.7-day ticket.

## Local gains, not system outcomes

None of this is new, by the way. Anyone who has read *The Goal* or *The Phoenix Project* knows that optimising a step that isn't the constraint just moves the pile of work somewhere else. AI is simply the most dramatic, most heavily funded, most *demo-able* way we've ever found to optimise a non-constraint.

And because it's so demo-able, it's very easy to mistake a faster step for a faster organisation.

The pattern we saw, and that I now see almost everywhere: when AI starts with engineering alone, individual engineers get faster, but throughput moves only a little. Intake at the front and testing and deployment at the back have to move too, or the gain evaporates.

## What actually changes the outcome

If the tools aren't the lever, what is? It's structure. Here's what I'd do differently from day one.

### 1. Choose the team before you choose the tool

Team set-up mattered far more than any mid-flight correction. The teams that will show you a real result tend to have clear product ownership, authority to change how they work, release independence, few outside dependencies, working environments and access, a sponsor, and, crucially, some appetite. Treat team selection and preparation as a formal phase of the work, not as admin.

### 2. Map the wait, then kill the biggest one first

Before you add a single agent, split cycle time into *working* and *waiting*. If most of the elapsed time is waiting, your first AI investment might not be AI at all. It might be an approval that doesn't need to exist.

### 3. Treat context as infrastructure

Every team re-discovers the same things: the architecture decision nobody wrote down, the business rule that lives in one person's head. Shared, owned, current, access-controlled context is the prerequisite for anything agentic. It's not a nice-to-have; it's an operating model in its own right, with owners and freshness and provenance.

### 4. Enablement *is* implementation

A licence and a lunch-and-learn don't change habits. Coaching, pairing, champions and genuinely protected experimentation time belong in the definition of done, along with the team being able to run without you.

### 5. Agree a measurement contract before you start

Different Jira states, different quality processes and different team shapes make cross-team comparison almost meaningless. So now I push for the same four measures on every engagement, baselined *before* any AI work starts and reported every two sprints:

- **Adoption:** how much of the work AI is actually used on
- **Step effort:** time saved on the step AI touches
- **End-to-end flow:** whether work finishes sooner, split into working and waiting
- **Quality:** whether the speed is costing you rework or defects

Alongside them, record each team's conditions (environments, access, release independence, dependencies, approvals). That's what explains why the same measure moves differently between two teams.

### 6. Give each team a different path

Maturity isn't uniform, and it tends to follow the platform. Greenfield teams on modern stacks can start almost at the "team built around AI" end. Teams on legacy estates may need modernising before AI uplift makes sense at all.

So the support should change shape too. For a team just starting out, I'd put most of the effort into business value, process and change, with only around 10% in engineering. For a team that's already mature, it flips: roughly 70% engineering, with the other disciplines checking in rather than running the work. The less mature the team, the less this is a technology problem.

## The honest bit

I want to be clear about what we *haven't* shown. We haven't proven that AI tooling has increased delivery throughput across a whole enterprise. We've shown real, local gains; a lot of reusable capability; and a much clearer picture of the conditions that value depends on.

I'm increasingly comfortable saying that out loud. If someone tells you they've already achieved enterprise-wide AI productivity gains, ask them one question: *how much of your cycle time is waiting, and did that number move?*

## Where this goes next

Here's the thing that's got me most excited, though. Once you've done the structural work (the context, the measures, the team shape, the gates), the interesting question stops being "how do I make an engineer faster?"

It becomes: *which parts of this flow could agents run, and what has to be true for me to trust them?*

That's the next post: what it looks like to wrap agents in a deterministic harness, so the things building the software are governed as carefully as the software itself.

And after that, the uncomfortable people question: if the shape of the work changes this much, who do we actually need to hire?

---

*This is part 2 of a series. Part 1: [The Metrics That Matter in an AI-Accelerated Product Development Lifecycle](/LINK-TO-JULY-POST). Part 3 (agents and harnesses) and part 4 (the people we'll need) are coming soon.*
