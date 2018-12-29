Param(
    # The category for the image we want to grab from Unsplash.
    # By default this is "Nature", but "Technology" can also be good!
    [Parameter(Mandatory=$false)][string]$CategoryName = "nature"
);


$BASEPATH_HEADERS = '.\assets\headers\';
$BASEPATH_POSTS = '.\_posts\';

ForEach ($post in Get-ChildItem $BASEPATH_POSTS*.md) { 
    $safeName = $post.Name.Replace(".md","");
    $requiredFile = $BASEPATH_HEADERS + $safeName + ".png";
    if (!(Test-Path $requiredFile))
    {
        Write-Host "Post named '$safeName' located without header"
        
        Write-Host " > Waiting for two seconds to prevent spamming Unsplash"
        Start-Sleep -Seconds 2;
        Write-Host " > Downloading header for post from category '$CategoryName' to '$requiredFile'"
        
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest https://source.unsplash.com/category/$CategoryName/800x400 -OutFile $requiredFile
        Write-Host " > Royalty-free image downloaded from Unsplash successfully"
        
        Write-Host " > Adding image to blog-post"
        Invoke-Expression ".\AddMissingImage.ps1 $safeName"

        Write-Host "Image processing complete for '$safeName'"
    }
}

