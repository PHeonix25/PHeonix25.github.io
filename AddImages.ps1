# gci .\_posts\*.md | % { $_.Name }  | % {.\AddMissingImage.ps1 $_}

Get-ChildItem .\_posts\*.md 
| ForEach-Object { $_.Name }  
| ForEach-Object { .\AddMissingImage.ps1 $_ } 