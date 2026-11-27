---
title: "The steps got faster but the work didn't."
description: "AI can make individual engineering tasks faster without improving delivery. The difference is in the system around the work: the waiting, hand-offs, and bottlenecks."
date: 2026-11-20
category: engineering
tags: [ai, engineering-leadership, flow, metrics, agents]
---

Over the last few months, I've been working with teams using AI in an established enterprise. Not a startup. Not a greenfield demo. Teams with long-lived systems, existing processes, and all the dependencies that come with them.

I wanted to know what would happen if we measured the work and then tried to improve it. One thing became clear pretty quickly: the bit we made faster wasn't necessarily the bit holding delivery back.

## The first result looked great

We started with engineering. We looked at velocity, scaffolding time (from a story going *In Progress* to the first meaningful commit), and rework (commits after the first implementation of a story).

Scaffolding time improved substantially. On that measure, the AI-assisted step was getting faster.

But velocity fell in one team and rose in another. Rework moved in different directions too. That's not a tidy before-and-after story, and I don't want to pretend it is.

The step AI touched got faster. End-to-end delivery didn't improve consistently - or at all!

That's not a verdict on either team. They were set up differently, the tools arrived at different times, and people had little protected time to learn. But those aren't footnotes, they're part of the system the work has to move through, and the system can absolutely absorb the gains.

## So we looked upstream

If the build isn't the only constraint, maybe we should look at what happens before it? We tried using AI to help turn intent into well-formed, development-ready stories.

Where it was used, story cycle time came down. But uptake wasn't consistent enough to change how the whole team worked. Useful, yes. A magic lever, no, definitely not.

That's the thing about a tool that helps with one task: if it isn't part of the way the team works, it can't do much for the team's overall flow. If you're not integrating it into the team's process, it won't change the overall delivery.

## Then we followed the work

The question that **changed** how I think about this wasn't "does AI make this step faster?" It was a much less glamorous one: *where does the time actually go?*

When we looked at work end-to-end, a lot of the elapsed time wasn't time spent doing the work at all! It was waiting: for approvals, hand-offs, environments, or someone else's queue.

That's time a coding assistant won't ever get back for you.

You can make the working time faster and still leave the bigger wait untouched. That's not an AI problem. It's a flow problem. It's a process problem. It's an organisational problem!

## Faster steps aren't the same as better flow

None of this is new. If you've read *The Goal* or *The Phoenix Project*, you'll recognise the pattern: optimise a step that isn't the constraint and the queue just moves somewhere else.

AI makes that mistake especially tempting because the improvements are visible, heavily funded and very *demo-able*. It's easy to mistake a faster step for a faster organisation.

What I saw was that when AI starts with engineering alone, individual engineers can get faster without a matching change in throughput. Intake, testing and deployment matter too. If work can't move through those parts of the system, the local gain has nowhere to go.

## What I'd change next time

The tools matter, but they aren't the whole intervention. Here's where I'd put the effort.

### 1. Choose the team before you choose the tool

Team set-up mattered more than any mid-flight correction we could make. Before starting, I'd look for clear product ownership, authority to change how the team works, manageable dependencies, working environments and access, a sponsor, and some appetite to try this.

Getting those conditions in place is part of the work, not 'admin' to squeeze in around it.

### 2. Map the wait, then tackle the biggest one

Before adding an agent, split cycle time into *working* and *waiting*. If most of the elapsed time is waiting, the first useful change may not involve AI at all. It might be removing an approval that isn't helping.

### 3. Treat context as infrastructure

I've watched teams rediscover the same things: the architecture decision nobody wrote down, the business rule that lives in one person's head.

Agents need context people can trust too. Shared, current, accessible context, with clear owners and provenance. That takes ongoing work; it isn't a one-off prompt-writing exercise.

### 4. Enablement *is* implementation

A licence and a lunch-and-learn won't change habits by themselves. Don't get me wrong, they can help, **but** coaching, pairing, champions and protected time to experiment need to be part of the plan. The goal should be to get the team to a point where it can keep going without the people who came in to help.

### 5. Agree what success means before you start

Different work item states, quality processes and team shapes make comparisons messy. So agree on the measures before the work starts, baseline them, and review them regularly:

- **Adoption:** is AI being used in the work, and where?
- **Step effort:** is the step AI touches taking less effort?
- **End-to-end flow:** is work finishing sooner, and how much time is working versus waiting?
- **Quality:** is the speed costing you rework or defects?

I'd also record the conditions each team is working in: environments, access, release independence, dependencies and approvals. Without that context, a difference in the numbers is hard to explain, let alone act on.

### 6. Give each team a different path

Teams aren't starting from the same place. Greenfield teams on modern stacks can experiment with AI-native ways of working sooner. Teams on legacy estates may have platform work to do first.

The support should reflect that. A team just starting out may need more help with business value, process and change. A more mature team may need deeper engineering support. There's no magic split; the less ready the team is, the less this is just a technology problem.

## The honest bit

I want to be clear about what we *haven't* been able to demonstrate (yet). We haven't proven that AI tooling increases delivery throughput across an entire enterprise. We have seen local gains, and a much clearer picture of the *conditions* those gains depend on.

I'm comfortable saying that out loud: If someone tells you *"AI has transformed our delivery"*, ask *"What happened to the waiting? **Did work actually get to customers sooner?"***

The point isn't to prove AI is good or bad. It's to find out whether delivery got better. If all we measure is how fast one step became, all we've shown is that one step got faster - and that's not the same thing.
