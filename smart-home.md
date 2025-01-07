---
layout: page
title: Pat's Home Automation
permalink: /smart-home/
---

Hey Google Reviewers & visitors from my 'Google Company Profile' 👋

## Background 

I'm Pat, and I'm a huge fan of Home Automation, including, but not limited to [Home Assistant](https://www.home-assistant.io/) and run a decently sized home-lab where, for many years, I've hosted Proxmox for my local infrastructure-related VM's, and Portainer for running many many containers to experiment or offer local media streaming, etc.

**One of the primary goals for hosting your own "smart home" is having it "just work" for the rest of your household, and visitors, etc.**

While most of my family is used to using a combination of Home Assistant's interfaces (dashboards, mobile app, etc.), hardware smart switches and buttons, as well as "Hey Jarvis" for a local-only voice command & control system; there's the occasional visitor, or slip-up where we default back to asking "Hey Google" to control these 'local' smart devices.

## Setup

In order to get this to work, [Home Assistant recommends standing up an integration that you own & manage in GCP](https://www.home-assistant.io/integrations/google_assistant/#google-cloud-platform-configuration) that interacts with your Home Assistant interface, but can execute actions in/with/on-behalf-of Google and keep device state in sync. Therefore, you can "expose" devices to Google, and when we (or a visitor) shout "Hey Google, turn off the Kitchen lights" then Google can execute that action by sending an intent to Home Assistant which will then execute the request, locally.

One recent improvement on this setup is that [Google will now allow Actions to run "Local Fulfillment"](https://www.home-assistant.io/integrations/google_assistant/#enable-local-fulfillment) so if the device that HEARS this command is a locally-hosted Google device (like our Hubs, etc.) then it can execute the command locally (_i.e.: send it across my home network to the HA instance_), without needing the "Cloud to Cloud Fulfillment" interactions and associated latency.

This interaction also works in the opposite direction as well, allowing Google to track the state of certain devices (like which lights are turned on, etc.) for the devices that Google knows about.

## Problem Statement

Prior to December 2024, it was sufficient to configure these actions in Developer-mode in GCP, and call the SmartHome API's with your Action, leaving it hosted in "Test" mode, but with the correct configuration to talk to your public Home Assistant endpoint -- and this was working well!

However, in December 2024, Google migrated everyones Actions to the Google Developer Console, and with that, now require 'Certification' and a 'Company Profile' in order to host these same Actions & have them available in the Google Home app under the "Works with Google" directory (similar to the Android Marketplace)

Unfortunately, there is no easy way to complete this as an individual, and so you now need a 'Company Profile', and in completing/submitting the 'Company Profile', you need a web-presence (_this website_), a physical presence (my house), as well as a [Privacy Policy](https://hermens.com.au/privacy) and (the difficult bit?) _"proof that you build smart-enabled devices"_:

> **Policy violation**
> Your integration has a policy violation. For help, please review the enforcement section of the policy or contact us for support.
> - _The company website does not appear to build any smart enabled devices_

## Resolution

I'm making & hosting this page so that I can link to it from my Google Company Profile in the hopes of explaining why, although I enjoy fiddling with firmware, and have literally hundreds of smart-devices exposing thousands of data-points (Home Assistant's 'Entities') within my house, connecting that seamlessly to Google is the reason I need a "Company Profile". 

To be clear: **I do not intend to build smart devices, I merely wish to connect my personal Home Assistant instance to Google's Cloud Actions -- for my own personal use!**

----

I hope this clarifies the situation?

If not, just [send me an email](mailto:p@hermens.com.au) -- or reject the application again and I'll have to find another way?
