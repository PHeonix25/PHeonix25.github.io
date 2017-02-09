Param(
    # The path to the post we need to add the image to
    [Parameter(Mandatory)][string]$BlogPostName
);

$BASEPATH_HEADERS = '.\assets\headers\';
$BASEPATH_POSTS = '.\_posts\';

$PLACEHOLDER_TEXT = "<!--description-->";
$IMAGE_FORMAT_REGEX = "!\[$BlogPostName\]\(.*$BlogPostName.png\)";
$IMAGE_FORMAT = "![$BlogPostName](/assets/headers/$BlogPostName.png)";

$POST_NAME = "$BASEPATH_POSTS$BlogPostName.md";
$POST_CONTENTS = Get-Content $POST_NAME;

if (Select-String -Pattern $IMAGE_FORMAT_REGEX -InputObject $POST_CONTENTS -Quiet) { 
    Write-Host "We have located an image in that post. Skipping processing.";
}
else {
    Write-Host "No image found. Adding now...";
    
    $POST_CONTENTS | 
    ForEach-Object { 
        $_ -replace $PLACEHOLDER_TEXT, "$PLACEHOLDER_TEXT`r`n$IMAGE_FORMAT" 
    } | 
    Set-Content $POST_NAME

    Write-Host "Image has been added immediately following '$PLACEHOLDER_TEXT'"
}