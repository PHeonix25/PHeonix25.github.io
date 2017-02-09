---
layout: post
title: "Getting Started with Jekyll - Setting up Jekyll in Docker"
date: 2016-10-08 00:00:00 +0000
categories: jekyll docker
published: true
---

In this post we're going to get our site up and running locally, taking advantage of Docker and a quick feedback loop.
<!--description-->
![2016-10-08-Getting-started-with-Jekyll-Part-4](/assets/headers/2016-10-08-Getting-started-with-Jekyll-Part-4.png)

1. [Getting Started with Jekyll - Setting the Scene][ph-part1]
2. [Getting Started with Jekyll - Finding a Theme][ph-part2]
3. [Getting Started with Jekyll - Common Theme Settings][ph-part3]
4. Getting Started with Jekyll - Setting up Jekyll in Docker **<==**
5. [Getting Started with Jekyll - Learning Markdown and Liquid][ph-part5]
6. [Getting Started with Jekyll - Modifying Templates][ph-part6]
7. [Getting Started with Jekyll - Transitioning Content][ph-part7]
8. [Getting Started with Jekyll - Launching your Site][ph-part8]

## Disclaimer - this is for Windows.

First of all, I want to say that this particular step and the advice below is designed for Windows (10, Home or Pro). If you're using a Mac, or Linux, or a VM, then there are plenty of other guides available for you and it might even be easier to "just get it up and running". The steps that I want to outline below cover off some of the "gotcha's" that I had getting this up and running on both `Docker for Windows` (on Windows 10 Pro) and `Docker Toolbox` (on Windows 10 Home). Where required I'll try and outline any differences, but I hope for you, following this, that everything *just works*.

## Understood, so what do I need?

You'll need at least one of the following installed:

- Docker Toolbox (v1.12) [from here][docker-toolbox] **OR**
- Docker for Windows (v1.12) [from here][docker-windows]

If you have either of those installed I'll step you through the rest below. 
Oh, and I'm assuming that you understand a little bit about how Docker works, and what it means to run/control containers. If not, that's cool but do yourself a favour and jump over [here][docker-started] and give it a read first -- it'll definitely be worth the 10 minutes it takes you.

I'm also assuming that you're using Powershell (because this is Windows) or that you're able to translate these commands into MING/Bash/whatever. I think they are the same across both platforms, but I'd prefer you just start using Powershell (it'll make my friend [Flynn][bundy-blog] happy).

## Great! Lets get moving!

First of all, you're going to want to create a `Dockerfile`. I'll start by showing you mine (*the start to every great story*):

```
# Graciously thank starefossen for his base image
FROM starefossen/github-pages
# Copy everything from the current directory into the image
COPY . /usr/src/app
# Set the locale and override the image settings
ENV LC_ALL C.UTF-8
# Expose port 4000 in this image
EXPOSE 4000/tcp
```
*Now, I'll step you through what each line means above, if you're good with those commands, feel free to skip to the next section.*

Firstly, we say `FROM` and we list a publicly available image (in this case a nicely set up image from `starefossen`). Docker will go looking for this image in the public Docker Hub and pull it down for us (it's about 800Mb). 
> **NOTE** - There IS an "official" [`jekyll/jekyll:pages` image][jekyll-image] that is supposed to be the same as the one from GitHub, but I've not had much luck getting it to work, primarily because of [this issue][docker-issue31] which they flagged as `enhancement` and `closed` but is still a problem. So for now my recommendation is to use `starefossen`'s image, and if they ever decide to support Jekyll on Windows 10 **because they still officially don't** then switch this line out for that image.

Secondly, we want to `COPY` everything from the current directory (the dot) to `/usr/src/app` inside the container. This is to give Jekyll a "starting point" in case your mounting volumes (in the next section) doesn't work out.

Third, we want to set the environment variable `LC_ALL` on the target system to the value `C.UTF-8` to prevent `jekyll 3.1.6 | Error:  Invalid US-ASCII character "\xE2"` errors. For the record, that character doesn't exist in any of the files in my site, but there's something stupid going on that [has been sitting in the Jekyll issues list on GitHub][jekyll-issue4268] for quite some time. The simplest solution is to just change the locale. You can Google this all you want, and you can rebuild the locales on the image, and you can try and hunt down anything that's not supported in US-ASCII like I did, but for now, just add this line to your Dockerfile and save yourself the headache.

Finally, we want to `EXPOSE` the port that we are going to use from the image. This is the port that the Jekyll server process inside the image is going to listen on, and respond to. We can always remap that to something different later for our local testing, and when our site goes live, it'll live on port 80 because GitHub doesn't use this Dockerfile.

## Let's build our first image!

Now that we have our Dockerfile, we should ask Docker to build us our image. 

To do this we want to run 

```
docker build . -t blog:latest
```
*If this command makes sense to you - feel free to skip ahead to the next section. If not, basically we're saying the following:*

- `docker build` is the command,
- `.` is the "working directory" that contains our `Dockerfile`
- `-t blog:latest` is the "tag" that we're going to name our image (the 'latest' version of our 'blog') - but you can change this to whatever you want.  

Hopefully after running the `docker build` command, it looks something like the snippet below:

```
$ docker build . -t blog:latest
Sending build context to Docker daemon 831.5 kB
Step 1 : FROM starefossen/github-pages
latest: Pulling from starefossen/github-pages
6a5a5368e0c2: Pull complete
7b9457ec39de: Pull complete
ff18e19c2db4: Pull complete
6a3d69edbe90: Pull complete
eaf982eec5d9: Pull complete
e7587c67cc39: Pull complete
f75b3a5b2dbd: Pull complete
f5ec07ccbb2c: Pull complete
c61008b8007b: Pull complete
eb95cd4a3855: Pull complete
f9fffd086a6b: Pull complete
b68c93f21acc: Pull complete
Digest: sha256:4ea6985b6f4a650e437876f97f6db110de92b3a8872ae120c1d602caabdd104b
Status: Downloaded newer image for starefossen/github-pages:latest
 ---> c6e5ee6a8a17
Step 2 : COPY . /usr/src/app
 ---> eb2e7b68177f
Removing intermediate container a538a5c6194e
Step 3 : ENV LC_ALL C.UTF-8
 ---> Running in efb01208ed78
 ---> 47b4ee931d7f
Removing intermediate container efb01208ed78
Step 4 : EXPOSE 4000/tcp
 ---> Running in b586e8c215d5
 ---> fe3a1310de9e
Removing intermediate container b586e8c215d5
Successfully built fe3a1310de9e
SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.
```

To confirm that we have our image (*ready for instantiation*) you can run `docker images` and you should see something like the below:

```
$ docker images
REPOSITORY                 TAG                 IMAGE ID            CREATED             SIZE
blog                       latest              bbe258a9860c        12 minutes ago      840 MB
starefossen/github-pages   latest              c6e5ee6a8a17        10 days ago         839 MB
```

> **NOTE** - I know 840Mb is quite big for base image, but that's the price we're going to pay to make sure that we have this as easy as possible -- remember the points about the `jekyll/jekyll:pages` image above? That base image is about 123Mb, but it just doesn't work nicely with Windows (in my experience)

## So the image built, let's run a container!    

Now that we have an image that we can build containers from, lets get one up and running!

```
docker run -i -p 4000:4000 -v=$(pwd):/usr/src/app/ blog:latest
```

To explain:

- `docker run` is the command,
- `-i` asks Docker to run this image "interactively" (stealing our window) 
  - Note: *We will change this to `-d` (daemon mode) later when we've confirmed everything is working properly* 
- `-p 4000:4000` is asking Docker to map a port from the container to the host
  - *This is where you can change the outward-facing port*
  - *A common mistake is to include the IP here (like 127.0.0.1:4000:4000) - **don't do this** as it'll only bind to a single adapter inside the container. Let it bind to all (0.0.0.0) which is the default behaviour*
- `-v` is a little tricky, but you're asking Docker to mount a "volume"
  - `$(xxx)` means run `xxx` as an inline command that should be expanded out first
  - `pwd` is a Bash command that returns the full path to the current directory
  - `/usr/src/app` is where we want it to 'appear' within the container
- `blog/latest` is the image that we want to use - *so if you changed it above, replace it here*

The trickiest part I've had with working with Docker on Windows is mounting volumes. Jekyll has some **great** functionality where it can monitor files in a directory and constantly re-generate them if they change on disk - which is awesome for testing your site and ensuring your Markdown is playing nice, especially while you're learning. 
So we want to map our local directory (`$(pwd)`) to the directory Jekyll is monitoring (`/usr/src/app` in this image), but file permissions on Windows are tricky, so if this doesn't work out for you, you can remove the `-v` command and just rebuild the container - which should be quick once the base image is local.

That being said, once this container is up and running you should see something like the below:

```
$ docker run -p 4000:4000 -v=$(pwd):/usr/src/app -t blog:latest
Configuration file: /usr/src/app/_config.yml
            Source: /usr/src/app
       Destination: /_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 0.658 seconds.
 Auto-regeneration: enabled for '/usr/src/app'
Configuration file: /usr/src/app/_config.yml
[2016-10-11 20:17:26] INFO  WEBrick 1.3.1
[2016-10-11 20:17:26] INFO  ruby 2.3.1 (2016-04-26) [x86_64-linux]
[2016-10-11 20:17:26] DEBUG WEBrick::HTTPServlet::FileHandler is mounted on /.
[2016-10-11 20:17:26] DEBUG unmount .
[2016-10-11 20:17:26] DEBUG Jekyll::Commands::Serve::Servlet is mounted on .
    Server address: http://0.0.0.0:4000/
[2016-10-11 20:17:26] INFO  WEBrick::HTTPServer#start: pid=5 port=4000
  Server running... press ctrl-c to stop.
```

## Let there be light!

Now, if you switch over to your browser, you should be able to go to `http://localhost:4000` (or maybe `http://192.168.99.100:4000` if you're running Docker Toolbox = see the NOTE below) and live-preview your site!

> **NOTE** - If you're using Docker Toolbox, it can be hard to figure out what the IP actually is because it's deep in the Docker-Machine config. Keep an eye on IP addresses that are mentioned when Docker is starting to get a clue for the "host" IP - this is often **not** localhost, or 0.0.0.0!

If you're modifying your site, and you managed to mount the directory without any issues, and want to check out the "live" results, just confirm that you can see something like this in the console first:

```
Regenerating: 1 file(s) changed at 2016-10-10 20:17:38 [2016-10-10 20:17:38] 
    ...done in 0.268916244 seconds.
```

... and there you go, you've got Jekyll running inside a Docker container, with mapped ports and constant page regeneration. You're ready to roll!

## EEK, nothing rendered for me (or I see "site returned no data")

First of all, check the console for errors. I see this happen all too often when I get too trigger happy and make a formatting mistake (like linking to a non-existent post) and Jekyll's parser throws an error but I was too busy Alt-Tabbing to see it. If there are red values in your console, you're going to need to fix them before the site will render and then the server will launch.

Secondly, if there aren't any errors, check your port mapping and IP address. Remember that if you're using the Docker Toolbox you'll need to see what auto-generated IP it has chosen for you (mostly 192.168.99.100 in my experience)

Finally, if you truly can't figure it out, make sure that your container is running (using `docker ps -a` - you should see "Up X minutes" in the status section) and if not, try deleting the container and starting again - or if you're braver than me and feel like wasting your time, then `exec /bin/sh` into the container and go looking for logs. 

## This is great, but can it be easier?

![Yes, script all the things!](/assets/img/script-all-the-things.jpg)

I have two scripts that I've really come to rely on for working with Docker. They are `BuildAndRun` and `StopAndRemove` - I hope from the naming that they are straightforward and I won't need to explain too much. 

Basically [`Docker.BuildAndRun.ps1`](/Docker.BuildAndRun.ps1) contains the following:

```powershell
# Build the image (called blog, version 'latest')
docker build . -t blog:latest 

# Run an instance of the image in the background, opening port 4000 as well
docker run -d -p 4000:4000 -v=$(pwd):/usr/src/app blog:latest

# Launch the browser so that we can check our work
start 'http://localhost:4000/'
```
 
and [`Docker.StopAndRemove.ps1`](/Docker.StopAndRemove.ps1) contains the rest:

```powershell
$containers = docker ps -a -q -f ancestor=blog:latest;

Write-Host ''

If ($containers -eq $null)
{
    Write-Host -ForegroundColor Gray 'There is nothing to remove. You are done here; go have fun!' 
}
Else {
    Write-Host -ForegroundColor Gray 'Found' $containers.Count 'container(s) to remove.'
    Write-Host -ForegroundColor Gray 'Sit back and relax - this may take a moment.'
    Write-Host ''
}

ForEach ($container in $containers)
{
    Write-Host 'Stopping' $container;
    Write-Host -NoNewline 'Stopped' $(docker stop $container);
    Write-Host -ForegroundColor Green ' ['$([char]8730)']'

    Write-Host 'Destroying' $container;
    Write-Host -NoNewLine 'Destroyed' $(docker rm $container);
    Write-Host -ForegroundColor Green ' ['$([char]8730)']'

    Write-Host -ForegroundColor Green 'Destruction of' $container 'should be complete.';
    Write-Host ''
}

Write-Host ''
```

> Thanks to [Matt Hodgkins][hodgkins-blog] and Niels (*nope, no link*) for the inspiration in making these 🙂

## Anything else that could mess me up?

Occasionally I've found that even when everything goes right, and the mounting works, and the container reports that it's up and running - if I haven't launched the container in daemon/detached mode (`-d`) then the site will render but nothing will update. Adding `-d` to my Docker commands (as shown in the Powershell scripts above) fixed that issue for me.

Apart from that, keep an eye on the [Jekyll Issues][jekyll-issues] list on GitHub, and Google will be your friend as more and more people start working with this.

## So Jekyll is running in Docker; what's next?

Hopefully now you have a working blog running on a local URL, but looking quite like the template that you chose in [Part 2][ph-part2]. 
Lets go through some basic formatting steps with Markdown and Liquid to help you pump out those posts in no time at all, over in [Part 5][ph-part5]! 


[ph-part1]:   {% post_url 2016-10-01-Getting-started-with-Jekyll-Part-1 %}
[ph-part2]:   {% post_url 2016-10-05-Getting-started-with-Jekyll-Part-2 %}
[ph-part3]:   {% post_url 2016-10-07-Getting-started-with-Jekyll-Part-3 %}
[ph-part4]:   {% post_url 2016-10-08-Getting-started-with-Jekyll-Part-4 %}
[ph-part5]:   {% post_url 2016-10-14-Getting-started-with-Jekyll-Part-5 %}
[ph-part6]:   {% post_url 2016-10-17-Getting-started-with-Jekyll-Part-6 %}
[ph-part7]:   {% post_url 2016-10-20-Getting-started-with-Jekyll-Part-7 %}
[ph-part8]:   {% post_url 2016-10-22-Getting-started-with-Jekyll-Part-8 %}

[docker-toolbox]:   https://www.docker.com/products/docker-toolbox
[docker-windows]:   https://docs.docker.com/docker-for-windows/
[docker-started]:   https://docs.docker.com/engine/getstarted/
[bundy-blog]:       https://flynnbundy.com/
[jekyll-image]:     https://github.com/jekyll/docker/wiki
[docker-issue31]:   https://github.com/jekyll/docker/issues/31
[jekyll-issue4268]: https://github.com/jekyll/jekyll/issues/4268
[hodgkins-blog]:    https://hodgkins.io/
[jekyll-issues]:    https://github.com/jekyll/jekyll/issues
