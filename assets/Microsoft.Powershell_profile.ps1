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

            $profilePath = "C:\Users\p.hermens\Documents\WindowsPowerShell\Modules\posh-git\profile.example.ps1"
            Write-Verbose "Resolving and executing GitHub profile from $profilePath"
            . (Resolve-Path $profilePath)

            Write-Verbose "Adding personal SSH key to the running agent"
            Add-SshKey "C:\Users\p.hermens\Dropbox\Technical\Personal Keys\PHeonix25_openssh_fixed.ppk"
            Write-Verbose "SSH key 'PHeonix25_openssh_fixed.ppk' added."
            Add-SshKey "C:\Users\p.hermens\Dropbox\Technical\Personal Keys\PHeonix25_June2017.ppk"
            Write-Verbose "SSH key 'PHeonix25_June2017.ppk' added."

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
}

# Load posh-git example profile
#. 'C:\Users\p.hermens\Documents\WindowsPowerShell\Modules\posh-git\profile.example.ps1'

# Set the colors up as (customised) Solarized:
## Host Foreground
$Host.PrivateData.ErrorForegroundColor = 'Magenta'
$Host.PrivateData.WarningForegroundColor = 'Yellow'
$Host.PrivateData.DebugForegroundColor = 'Green'
$Host.PrivateData.VerboseForegroundColor = 'Blue'
$Host.PrivateData.ProgressForegroundColor = 'Gray'

## Host Background
$Host.PrivateData.ErrorBackgroundColor = 'Black'
$Host.PrivateData.WarningBackgroundColor = 'Black'
$Host.PrivateData.DebugBackgroundColor = 'Black'
$Host.PrivateData.VerboseBackgroundColor = 'Black'
$Host.PrivateData.ProgressBackgroundColor = 'Cyan'

## Check for PSReadline
if (Get-Module -Name "PSReadline") {
    $options = Get-PSReadlineOption

    ## Foreground
    $options.CommandForegroundColor = 'Yellow'
    $options.ContinuationPromptForegroundColor = 'DarkBlue'
    $options.DefaultTokenForegroundColor = 'DarkBlue'
    $options.EmphasisForegroundColor = 'Cyan'
    $options.ErrorForegroundColor = 'Red'
    $options.KeywordForegroundColor = 'Green'
    $options.MemberForegroundColor = 'DarkCyan'
    $options.NumberForegroundColor = 'DarkCyan'
    $options.OperatorForegroundColor = 'DarkMagenta'
    $options.ParameterForegroundColor = 'DarkMagenta'
    $options.StringForegroundColor = 'Blue'
    $options.TypeForegroundColor = 'DarkYellow'
    $options.VariableForegroundColor = 'Green'

    ## Background
    $options.CommandBackgroundColor = 'Black'
    $options.ContinuationPromptBackgroundColor = 'Black'
    $options.DefaultTokenBackgroundColor = 'Black'
    $options.EmphasisBackgroundColor = 'Black'
    $options.ErrorBackgroundColor = 'Black'
    $options.KeywordBackgroundColor = 'Black'
    $options.MemberBackgroundColor = 'Black'
    $options.NumberBackgroundColor = 'Black'
    $options.OperatorBackgroundColor = 'Black'
    $options.ParameterBackgroundColor = 'Black'
    $options.StringBackgroundColor = 'Black'
    $options.TypeBackgroundColor = 'Black'
    $options.VariableBackgroundColor = 'Black'
}