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
        Write-Host " > Downloading header for post to '$requiredFile'"
        Invoke-WebRequest https://source.unsplash.com/category/nature/800x400 -OutFile $requiredFile
        Write-Host " > Royalty-free image downloaded from Unsplash successfully"
        
        Write-Host " > Adding image to blog-post"
        Invoke-Expression ".\AddMissingImage.ps1 $safeName"

        Write-Host "Image processing complete for '$safeName'"
    }
}

