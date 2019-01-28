---
layout: post
title: "Chocolatey, and a new machine"
date: 2019-01-28 00:00:00 +0000
categories: chocolatey hardware
published: true
---

I'm wiping my laptop tomorrow and starting fresh, so I figured this was as good a time as any to document how I can bring a development machine up-to-speed ASAP, using [Chocolatey](https://chocolatey.org/).

<!--description-->

# Let's get started

I've been pretty religious in making sure that if I needed to install an application on this laptop then I would use Chocolatey wherever possible, but before we can even do this, we need to make sure that Chocolatey is installed:

## Install Chocolatey

This part is pretty straightforward! Chocolatey has [the instructions on their site](https://chocolatey.org/docs/installation#install-with-powershellexe), but the main command is this one:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

> **NOTE:** I am normally against using "`iex wc.DownloadString https://malware.ps1`" to install software, but I have chosen to trust Chocolatey.
> If you don't understand the risks of _"just running scripts from the Internet"_ - don't do this.

## Enable Windows subsystem for Linux

I do a fair amount of work in Linux during testing Docker containers and configuration, and WSL (the [Windows subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about)) makes this REALLY easy.

You can use a wrapper that's been written for Chocolatey to enable this (`choco install wsl`), because I can never remember the script, but for reference, on Windows 10 Pro you need to run the following command:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

The Chocolatey command is easier to remember though, and it will add the WSL to the list of installed software, so let's do that.  

```powershell
choco install -y wsl
```

You can then grab the image that you need (for me, the latest Ubuntu LTS will do) using the following command:

```powershell
choco install -y wsl-ubuntu-1804
```

## Install the other applications

> **NOTE:** Unfortunately, Chocolatey doesn't have a command (YET) to export everything that you have installed to a format that it can re-read. You can follow the development of this feature in [this feature request](https://github.com/chocolatey/choco/issues/357), but for now we can use the [`InstChoco`](https://chocolatey.org/packages/instchoco) package.

Once you have a PACKAGES.CONFIG file ([here's mine for future reference](/assets/PACKAGES.CONFIG)), it's pretty easy to tell Chocolatey to let rip:

```powershell
choco install ~/Downloads/PACKAGES.CONFIG -y
```

Or if you just want to use mine as a starting point:

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/PHeonix25/PHeonix25.github.io/master/assets/PACKAGES.CONFIG -OutFile ~/packages.config;
choco install (Resolve-Path ~/packages.config).Path -y
```

## Now, be patient

This can take over an hour, even on a brand new clean system. We're talking about installing 49 "packages", most of them are full applications, and one is even a complete Ubuntu image... At least this way it's all automated and I hope this gets you up and running faster than you'd expected.

## Time for some add-ons

### Pretty console?

One of the things that I like to do, depending on if it's a work machine or not, is personalise the console to set the color-scheme. For a work machine, this is not ideal because of the amount of demos and screen-sharing I need to do, but for a personal machine, like the one I use to blog late at night, changing everything over to a [Solarized Dark](https://ethanschoonover.com/solarized/) theme.

Over the years I've found the "right combination" that works for me, and saved it as a Registry file: [solarized-dark.reg](/assets/solarized-dark.reg). This was based off the work of Niel Pankey's [cmd-colors-solarized](https://github.com/neilpa/cmd-colors-solarized) with a slight modification of the purple color.

Import [this one](https://raw.githubusercontent.com/PHeonix25/PHeonix25.github.io/master/assets/solarized-dark.reg) into your registry, or if you want to know more about how to apply it system-wide, go check out the README [over here](https://github.com/neilpa/cmd-colors-solarized/README.MD).

### Configure PowerShell

The last thing that I always load onto a new machine is my [Microsoft.Powershell_profile.ps1](/assets/Microsoft.Powershell_profile.ps1). I just drop this file into `~/Documents/WindowsPowerShell` which is on the PATH so that it gets loaded by default whenever I open PowerShell.

There are a few custom commands I have in there (like `Start-Splunk` or `Start-Solution`), but the main reason I use it is to customise the prompt. Having it load my keys (saved in Dropbox) and show the Git status on the command line is a huge help when I'm developing. I'll normally run `Set-Prompt GitHub` whenever I'm starting work to make sure the environment is configured. You can [check it out here](https://github.com/PHeonix25/PHeonix25.github.io/blob/master/assets/Microsoft.Powershell_profile.ps1#L49), or download the whole thing like so:

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/PHeonix25/PHeonix25.github.io/master/assets/Microsoft.Powershell_profile.ps1 -OutFile ~/Documents/WindowsPowerShell/Microsoft.Powershell_profile.ps1;
. (Resolve-Path ~/Documents/WindowsPowerShell/Microsoft.Powershell_profile.ps1)
```

> **NOTE 1:** I have a whole section in there where I import my own Personal Keys into Pageant. You can remove that, or update it to point to your keys.

--
> **NOTE 2:** You'll also notice that I hard-coded the prompt colors at the end of the `_profile.ps1` at some point. I can't remember why I did that, but I'm guessing it's because they wouldn't stick with just the registry keys. Feel free to remove that whole block if you want.

---

## Got any other tips?

Let me know if you know of a better way to get your dev machine up and running?
Do you prefer [Ninite](https://ninite.com/)?
What's your take on [Chocolatey vs Scoop](https://github.com/lukesampson/scoop/wiki/Chocolatey-Comparison)?
Let me know in the comments below, or [over here on Twitter](https://twitter.com/{{ site.twitter_username }})