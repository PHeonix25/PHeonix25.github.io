$MaximumDisplayedPathLength = $pwd.Path.Split('\').Length

Function Format-Path
{
    $finalPath = $pwd
    $paths = $finalPath.Path.Split('\')
 
    if($paths.Length -gt $MaximumDisplayedPathLength){
        $start = $paths.Length - $MaximumDisplayedPathLength
        $finalPath = ".."
        for($i = $start; $i -le $paths.Length; $i++){
            $finalPath = $finalPath + "\" + $paths[$i]
        }
    }
 
    return $finalPath
}

Function Set-Prompt
{
    Param
    (
        [Parameter(Position=0)]
        [ValidateSet("Default","DC","GitHub")]
        $Choice
    )
    
    switch ($Choice)
    {
        "DC"
        {
            Function global:prompt 
            {
                #check and see if logon server is the same as the computername
                if ( $env:logonserver -ne "\\$env:computername" ) {
                    $label = ($env:logonserver).Substring(2) #strip off the \\
                    $color = "Green"
                }
                else {
                    $label = "Not Connected"
                    $color = "gray"
                }
             
                Write-Output ("[$label]") -ForegroundColor $color -NoNewline
                Write-Output (" PS " + (Get-Location) + "> ")
            }
        }

        "GitHub"
        {
            Write-Host ""
            Write-Output "Setting up Posh-Git"
            Import-Module posh-git

            Write-Verbose "Adding personal SSH key to the running agent"
            Add-SshKey (Resolve-Path "~\Dropbox\Technical\Personal Keys\PHeonix25_openssh.openssh")
            Write-Verbose "SSH key 'PHeonix25_openssh' added."
            Add-SshKey (Resolve-Path "~\Dropbox\Technical\Personal Keys\PHeonix25_June2017.openssh")
            Write-Verbose "SSH key 'PHeonix25_June2017' added."

            Write-Output "Prompt depth will be set to $MaximumDisplayedPathLength. "
            Write-Output "Please change the 'MaximumDisplayedPathLength' environment variable if you want something different."
            Function global:prompt {
                $realLASTEXITCODE = $LASTEXITCODE#
                Write-Host(Format-Path) -nonewline
                Write-VcsStatus
                $global:LASTEXITCODE = $realLASTEXITCODE
                return "> "
            }

            Write-Host ""
        }
        
        default
        {
            Function global:prompt
            {
                  $(if (test-path variable:/PSDebugContext) { '[DBG]: ' } else { '' }) + 
                  'PS ' + $(Get-Location) ` + $(if ($nestedpromptlevel -ge 1) { '>>' }) + '> '
            }
        }
    }
}

Function Edit-Profile { code $profile }
Function Reset-Profile { . $profile }

Function Start-Solution { Start-Process $(Get-ChildItem -Recurse *.sln | Select-Object -First 1 FullName).FullName }
Function Start-Portainer { docker run -d -p 9000:9000 portainer/portainer -H tcp://127.0.0.1:2375 }
Function Start-Splunk { docker run -d -e 'SPLUNK_START_ARGS=--accept-license' -e 'SPLUNK_USER=root' -p '8000:8000' splunk/splunk }
Function Start-AWSConsole { docker run -it --env-file ./.awscreds garland/aws-cli-docker /bin/sh }

Function Remove-DockerContainers { docker rm -f $(docker ps -a -q) }
Function Remove-DockerImages { docker rmi $(docker images -a | ForEach-Object { if ($_ -match '<none>\s+<none>\s+(\w+).*'){ $matches[1] }}) }

# Add some handy aliases for commands I can never remember
Set-Alias which Get-Command

# Chocolatey profile
$ChocolateyProfile = "$env:ChocolateyInstall\helpers\chocolateyProfile.psm1"
if (Test-Path($ChocolateyProfile)) {
  Import-Module "$ChocolateyProfile"
  Write-Host "Chocolatey profile imported." -ForegroundColor Gray
}

# Load posh-git profile
Import-Module posh-git
Write-Host "PoshGit profile imported." -ForegroundColor Gray

# # Set the colors up as (customised) Solarized:
. (Join-Path -Path (Split-Path -Parent -Path $PROFILE) -ChildPath 'Set-SolarizedDarkColorDefaults.ps1')