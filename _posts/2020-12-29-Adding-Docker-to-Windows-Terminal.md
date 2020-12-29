---
layout: post
title: "Adding Docker Containers to Windows Terminal"
date: 2020-12-29 00:00:00 +0000
categories: docker windows terminal
published: true
image: /assets/headers/2020-12-29-Adding-Docker-to-Windows-Terminal.png
---

On my latest project I've been debugging Windows Server 2016 & Windows Server 2019 issues using the [Microsoft Server Core](https://hub.docker.com/publishers/microsoftowner) docker containers.

I'm also a huge fan of the (not-so) new [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/), and wanted to find a way to incorporate a "fresh debugging environment" into a new tab.

<!--description-->

![2020-12-29-Adding-Docker-to-Windows-Terminal](/assets/headers/2020-12-29-Adding-Docker-to-Windows-Terminal.png)


## Windows Terminal Settings

Those of you that have already customised your Windows Terminal know that the "settings screen" is a JSON code block that opens in your default editor (VS Code for me).
It looks something like this:
![Windows Terminal settings](/assets/img/windowsterminal-settings.png)

## Add your new Docker commands as Profiles

In the list of Windows Terminal "Profiles" you'll see all the default ones it was able to detect on your system, normally PowerShell and cmd.exe.

To add a new profile, just copy one of the existing entries and change the `GUID` and the `name` values. I've prefixed my docker container profiles with a whale (🐳) so that I know it's hosted in `docker`.
```json
{
    "guid": "{a25a83da-5bd2-4c68-97b8-a8720a80cff7}",
    "name": "🐳 Windows Server 2016",
    "commandline": "docker run --rm -it --name windows-terminal-2016 mcr.microsoft.com/windows/servercore:ltsc2016 powershell",
    "suppressApplicationTitle": true
},
```

The key value here is the `commandline` argument! We can pass in any command that we want `cmd.exe` to run!

## Breaking down the command value

```json
{
    ...
    "commandline": "docker run --rm -it --name windows-terminal-2016 mcr.microsoft.com/windows/servercore:ltsc2016 powershell",
    ...
}
```

To break down the command, what we're asking is:
1. launch `docker`,
1. ask it to `run` a container,
1. ask it to remove the container when it exits (`--rm`),
1. ask it to attach the standard inputs (`-it`),
1. give the container a name (`--name windows-terminal-2016`)
1. and then using this base image: `mcr.microsoft.com/windows/servercore:ltsc2016`
1. run `powershell` to give us a prompt!

Yay, that's it! 

## Small gotchas...

1. Even though we asked Docker to remove the container when it exits, that only happens when you actually `exit` from Powershell in the container. If you close the tab (Ctrl+F4, or clicking the cross) then the container doesn't catch the exit signal and keeps on running. This means that next time you try and load the "tab" it'll fail with an "container with that name already exists"-error. You can avoid this error by removing the name from the command (it'll automatically generate a distinct one), but I'd prefer it like this for now.

1. If you're downloading a large container for the first time (or the container image has a significant update) this can lock up Windows Terminal until the image download is complete. I would recommend adding `--pull never` to the command if this is a problem for you.

1. Asking for the latest `servercore` image doesn't work ([BY DESIGN](container-version)), so you'll have to find your specific version at [on this page](https://hub.docker.com/_/microsoft-windows-servercore) and reference it explicitly!

1. I've set `suppressApplicationTitle` to `true` in order to leave our title-bar alone and for me to easily locate the debugging tab. It'll have the whale 😁

## Extending this logic

Knowing that you can run 'any' command, I've also added a divider to separate out my docker containers:

![Windows Terminal drop-down menu](/assets/img/windowsterminal-dropdown.png)

The 'profile' that I set up for the divider (_if it's accidentally launched_) is this:
```json
{
    "name": "---- Dockerised Containers ----",
    "commandline": "powershell -NoLogo -NoExit -Command \"& { Write-Warning 'Why did you launch me!? Ah well, here are all ya dockers:'; docker ps -as }\""
},
```

I hope this helps if you're looking for a quick and easy way to launch a dockerised debugging environment!

[container-version]: https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-20H2%2Cwindows-10-20H2#choose-which-container-os-version-to-use
