---
layout: post
title: "Chocolatey, and a new machine"
date: 2019-01-28 00:00:00 +0000
categories: chocolatey hardware software
published: true
image: /assets/headers/2019-01-28-Chocolatey-and-a-new-machine.png
---

I'm wiping my laptop tomorrow and starting fresh, so I figured this was as good a time as any to document how I can bring a development machine up-to-speed ASAP, using [Chocolatey](https://chocolatey.org/).

<!--description-->
![2019-01-28-Chocolatey-and-a-new-machine](/assets/headers/2019-01-28-Chocolatey-and-a-new-machine.png)

## Let's get started

I've been pretty religious in making sure that if I needed to install an application on my last personal laptop then I would use [Chocolatey](https://chocolatey.org/) wherever possible, but before we can use this to restore all my common apps, we need to make sure that Chocolatey is installed, so let's start there.

### 1. Install Chocolatey

This part is pretty straightforward! Chocolatey has [the instructions on their site](https://chocolatey.org/docs/installation#install-with-powershellexe), but the main command is this one:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

> **NOTE:** I am normally against using "`iex wc.DownloadString https://malware.ps1`" to install software, but I have chosen to trust Chocolatey.
> If you don't understand the risks of _"just running scripts from the Internet"_ - don't do this.

### 2. Enable Windows subsystem for Linux

I do a fair amount of work in Linux - mainly testing Docker containers and network/volume configuration, and WSL (the [Windows subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about)) makes this REALLY easy!

You can use a wrapper that's been written for Chocolatey to enable this (`choco install wsl`), but for reference, on Windows 10 Pro you need to run the following command:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

The Chocolatey command is easier to remember though, and it will add the WSL to the list of installed software, so let's do that instead:

```powershell
choco install -y wsl
```

You can then grab the image that you need (_for me, the latest Ubuntu LTS will do_) using the following command:

```powershell
choco install -y wsl-ubuntu-1804
```

### 3. Install the other applications

> **NOTE:** Unfortunately, Chocolatey doesn't have a command (YET) to export everything that you have installed to a format that it can re-read. You can follow the development of this feature in [this feature request](https://github.com/chocolatey/choco/issues/357), but for now we can use the [`InstChoco`](https://chocolatey.org/packages/instchoco) package.

Once you have a PACKAGES.CONFIG file ([here's mine for if you're interested](/assets/choco.config)), it's pretty easy to tell Chocolatey to let rip:

```powershell
choco install ~/Downloads/PACKAGES.config -y
```

Or if you want to use mine as a starting point:

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/PHeonix25/PHeonix25.github.io/master/assets/choco.config -OutFile ~/choco.config;
choco install (Resolve-Path ~/choco.config).Path -y
```

> **UPDATE 2019-02-07:** For whatever reason, this didn't work when it was called `PACKAGES.CONFIG`. I needed to rename it to literally ANYTHING ELSE and then everything worked fine. I have updated my config file to be `choco.config` because of this :)

### Now, be patient

This can take over an hour, even on a brand new clean system. We're talking about installing a bunch of "packages", where most of them are full applications, and one is even a complete other operating system!

At least this way it's all automated and I hope this gets you up and running faster than you'd expected.

---

### Time for some add-ons?

#### Prettify our console

One of the things that I like to do, depending on if it's a work machine or not, is personalise the console to set the color-scheme.
For a work machine, this is not ideal because of the amount of demos and screen-sharing I need to do, but for a personal machine, like the one I use to blog late at night, changing everything over to a [Solarized Dark](https://ethanschoonover.com/solarized/) theme.

Over the years I've found the "_right combination_" that works for me, and saved it as a Registry file: [solarized-dark.reg](/assets/solarized-dark.reg).
This was based off the work of Niel Pankey's [cmd-colors-solarized](https://github.com/neilpa/cmd-colors-solarized) with a slight modification of the purple color.

~~Import [this one](https://raw.githubusercontent.com/PHeonix25/PHeonix25.github.io/master/assets/solarized-dark.reg) into your registry~~, or if you want to know more about how to apply it system-wide, go check out the README [over here](https://github.com/neilpa/cmd-colors-solarized).

> **UPDATE 2019-02-07:** This didn't work when I tried it this time around... Please just follow the instructions in the `cmd-colors-solarized` git repo instead.

#### Customise PowerShell

The last thing that I always load onto a new machine is my [Microsoft.Powershell_profile.ps1](/assets/Microsoft.Powershell_profile.ps1). I drop this file into `~/Documents/WindowsPowerShell` which is on the PATH so that it gets loaded by default whenever I open PowerShell.

There are a few custom commands I have saved in there (like `Start-Splunk` or `Start-Solution`), but the main reason I use it is to customise the prompt.

Also, having it load my keys (saved in Dropbox) and show the Git status on the command line is a huge help when I'm developing. I'll normally run `Set-Prompt GitHub` whenever I'm starting work to make sure the environment is configured. You can [check it out here](https://github.com/PHeonix25/PHeonix25.github.io/blob/master/assets/Microsoft.Powershell_profile.ps1#L49), or download the whole thing like so:

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/PHeonix25/PHeonix25.github.io/master/assets/Microsoft.Powershell_profile.ps1 -OutFile ~/Documents/WindowsPowerShell/Microsoft.Powershell_profile.ps1;
. (Resolve-Path ~/Documents/WindowsPowerShell/Microsoft.Powershell_profile.ps1)
```

> **NOTE:** I have a whole section in there where I import my own Personal Keys into Pageant. You can remove that, or update it to point to your keys.
> **UPDATE 2019-02-07 - SSHKEYS:** Pageant was no longer necessary as Windows10 comes with OpenSSH! Yay! You'll need to enable the `OpenSSH Agent Service` via `Services`, but then it should "just work".
> **UPDATE 2019-02-07 - POSH-GIT:** I have also removed a lot of the clutter from the that is now incorporated into Posh-Git itself. Granted, you will need to follow [the instructions](https://github.com/dahlbyk/posh-git#installing-posh-git-via-powershellget) to install Posh-Git but once you do, then you can just call `Import-Module posh-git` from your profile [as shown here](https://github.com/dahlbyk/posh-git#using-posh-git)!

---

## Got any other tips?

Let me know if you know of a better way to get your dev machine up and running?
Do you prefer [Ninite](https://ninite.com/)?
What's your take on [Chocolatey vs Scoop](https://github.com/lukesampson/scoop/wiki/Chocolatey-Comparison)?
Let me know in the comments below, or [over here on Twitter](<https://twitter.com/>{{ site.twitter_username }})
