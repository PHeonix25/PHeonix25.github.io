---
title: "The steps got faster but the work didn't."
description: "AI cut scaffolding time by 71% and 89% in two teams. Delivery didn't improve consistently. What we learned about bottlenecks, waiting, and the system around the work."
date: 2026-11-20
category: engineering
tags: [ai, engineering-leadership, flow, metrics, agents]
draft: true
---

In July, I wrote about [the metrics that matter in an AI-accelerated product development lifecycle](/writing/2026-07-08-metrics-that-matter-in-pdlc). The short version: measure outcomes, not AI activity.

Since then, I've been applying that advice with real teams in a large, long-established enterprise. Not a startup or a greenfield demo: teams with history, mainframes, change boards and twenty-year-old release processes.

I wanted to know what would happen if we measured the work and then tried to improve it. The numbers were interesting. They also made it pretty clear that speeding up one step isn't the same as speeding up delivery.

## The first result looked great

We started where a lot of teams start: put AI tools in engineers' hands and see if the build gets faster.

Two delivery teams, five sprints, three measures agreed up front: velocity, scaffolding time (from a story going *In Progress* to the first meaningful commit), and rework (commits after the first implementation of a story).

Scaffolding time fell by **71%** in one team and **89%** in the other.

If I'd stopped there, I'd have had a cracking LinkedIn post.

But velocity in the first team went from 29 points a sprint to 12. In the second, it went from 62 to 76. Rework improved from 2.5 to 1.0 in one team, and went from 0 to 3.0 in the other.

The step AI touched got dramatically faster. End-to-end delivery didn't improve consistently. (Facepalm.)

That's not a verdict on either team. We had five sprints, the teams were set up differently, the tools arrived at different times, and people had little protected time to learn. But those aren't footnotes to the work. They're part of the system the work has to move through, and the system absorbed the gain.

## So we looked upstream

If the build wasn't the only constraint, maybe we should look at what happens before it. We tried using AI to help teams turn intent into well-formed, development-ready stories.

There was a useful signal: two teams saw cycle time per story drop by **17%** and **38%**. The samples were small, so I wouldn't make too much of those percentages on their own.

Adoption was the limit. At best, **29%** of stories were AI-created, against a target of 60 to 80%. If the tool is used on less than a third of the work, it's hard for it to change the whole team's results. Useful, yes. A magic lever, no.

## Then we followed one ticket

The third engagement changed how I think about this. Instead of asking "does AI make this step faster?", we asked a less glamorous question: *where does the time actually go?*

We baselined a cross-functional squad covering design, content, QA and build. A content ticket took **36.9 days** on average. **27.7 days** of that was waiting: for approvals, hand-offs, environments or someone else's queue.

That's about three quarters of the elapsed time in places a coding assistant can't reach.

We could make the time spent actively working on that ticket much faster and still leave most of its elapsed time untouched.

## Faster steps aren't the same as better flow

None of this is new. If you've read *The Goal* or *The Phoenix Project*, you'll recognise the pattern: optimise a step that isn't the constraint and the queue just moves somewhere else. AI makes that mistake especially tempting because the improvements are visible, heavily funded and very *demo-able*.

It's easy to mistake a faster step for a faster organisation.

What we saw was that when AI starts with engineering alone, individual engineers can get faster without a matching change in throughput. Intake, testing and deployment matter too. If work can't move through those parts of the system, the local gain has nowhere to go.

## What I'd change next time

The tools matter, but they aren't the whole intervention. Based on what we saw, here's where I'd put the effort next time.

### 1. Choose the team before you choose the tool

Team set-up mattered more than any mid-flight correction we could make. Before starting, I'd check for clear product ownership, authority to change how the team works, release independence, manageable dependencies, working environments and access, a sponsor, and some appetite to try this. Getting those conditions in place is part of the work, not admin to squeeze in around it.

### 2. Map the wait, then kill the biggest one first

Before adding an agent, split cycle time into *working* and *waiting*. If most of the elapsed time is waiting, the first useful change may not involve AI at all. It might be removing an approval that isn't helping.

### 3. Treat context as infrastructure

Teams keep rediscovering the same things: the architecture decision nobody wrote down, the business rule that lives in one person's head. Agents need context people can trust too: shared, current, access-controlled, with clear owners and provenance. That takes ongoing work; it isn't a one-off prompt-writing exercise.

### 4. Enablement *is* implementation

A licence and a lunch-and-learn won't change habits by themselves. Coaching, pairing, champions and protected time to experiment need to be part of the plan. So does getting the team to a point where it can keep going without the people who came in to help.

### 5. Agree a measurement contract before you start

Different Jira states, quality processes and team shapes make cross-team comparisons messy. So I now push to agree on the measures before the work starts, baseline them, and review them every two sprints:

- **Adoption:** how much of the work AI is actually used on
- **Step effort:** time saved on the step AI touches
- **End-to-end flow:** whether work finishes sooner, with working and waiting time tracked separately
- **Quality:** whether the speed is costing you rework or defects

I'd also record the conditions each team is working in: environments, access, release independence, dependencies and approvals. Without that context, a difference in the numbers is hard to explain, let alone act on.

### 6. Give each team a different path

Teams aren't starting from the same place. Greenfield teams on modern stacks can experiment with AI-native ways of working sooner. Teams on legacy estates may have platform work to do first.

The support should reflect that. As a rough guide, for a team just starting out I'd put most of the effort into business value, process and change, and perhaps 10% into engineering. For a more mature team, it might be closer to 70% engineering, with the other disciplines checking in rather than leading the work. Those aren't magic ratios; they're a reminder that the less ready the team is, the less this is just a technology problem.

## The honest bit

I want to be clear about what we *haven't* shown. We haven't proven that AI tooling increases delivery throughput across an entire enterprise. We have seen local gains, built reusable capability, and got a clearer picture of the conditions those gains depend on.

I'm increasingly comfortable saying that out loud. If someone tells you they've achieved enterprise-wide AI productivity gains, ask how much of their cycle time is waiting, and whether that number moved.

## Where this goes next

Once you've done some of the structural work - the context, the measures, the team shape, the gates - the interesting question changes. It stops being "how do I make an engineer faster?"

It becomes: *which parts of this flow could agents run, and what would need to be true for me to trust them?*

That's what I want to explore next: wrapping agents in a deterministic harness, so the things building the software are governed as carefully as the software itself.

After that, there's the people question: if the shape of the work changes this much, who do we need to hire?

---

*This is part 2 of a series. Part 1: [The Metrics That Matter in an AI-Accelerated Product Development Lifecycle](/writing/2026-07-08-metrics-that-matter-in-pdlc).*
