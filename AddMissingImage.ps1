Param(
    # The path to the post we need to add the image to
    [Parameter(Mandatory)][string]$BlogPostName
);

# Process the parameter to support passing in file names
if ($BlogPostName.EndsWith(".md")) {
    $BlogPostName = $BlogPostName.Replace(".md","")
};
Write-Host "Starting to process '$BlogPostName'";

$BASEPATH_HEADERS = '.\assets\headers\';
$BASEPATH_POSTS = '.\_posts\';

$PLACEHOLDER_TEXT = "<!--description-->";
$FRONTMETA_DIVIDER = "---";

$IMAGE_PATH = "/assets/headers/$BlogPostName.png";
$IMAGE_FORMAT_REGEX = "!\[$BlogPostName\]\(.*$BlogPostName.png\)";
$IMAGE_FORMAT = "![$BlogPostName]($IMAGE_PATH)";
$OGIMAGE_FORMAT = "image: $IMAGE_PATH"

$POST_NAME = "$BASEPATH_POSTS$BlogPostName.md";
$POST_CONTENTS = Get-Content $POST_NAME;

# Makes sure there is an image immediately following the break that has the post name
if (Select-String -Pattern $IMAGE_FORMAT_REGEX -InputObject $POST_CONTENTS -Quiet) { 
    Write-Host " > We have located an image in that post. Skipping processing.";
}
else {
    Write-Host " ! No image found. Adding now...";
    
    $POST_CONTENTS | 
    ForEach-Object { 
        $_ -replace $PLACEHOLDER_TEXT, "$PLACEHOLDER_TEXT`r`n`r`n$IMAGE_FORMAT`r`n" 
    } | 
    Set-Content $POST_NAME

    Write-Host -ForegroundColor Green " > Image has been added immediately following '$PLACEHOLDER_TEXT'"
}

# Updated to automatically add the OG Images too!
if (Select-String -Pattern $OGIMAGE_FORMAT -InputObject $POST_CONTENTS -Quiet) { 
    Write-Host " > We have located an OG image tag in that post. Skipping processing.";
}
else {
    Write-Host " ! No OG image found. Adding now...";

    $frontMetaOpen = $false;
    $frontMetaClosing = $false;
    $frontMetaProcessed = $false;

    $POST_CONTENTS | 
    ForEach-Object { 
        if ($_ -eq $FRONTMETA_DIVIDER) { 
            if ($frontMetaOpen) { $frontMetaClosing = $true } else { $frontMetaOpen = $true }
        }
        if ($frontMetaClosing -and !$frontMetaProcessed) {
            $_ -replace $FRONTMETA_DIVIDER, "$OGIMAGE_FORMAT`r`n$FRONTMETA_DIVIDER";
            $frontMetaProcessed = $true;
        }
        else {
            $_
        }
    } | Set-Content $POST_NAME

    Write-Host -ForegroundColor Green " > OG image has been added to the front meta."
}

Write-Host "Finished processing '$BlogPostName'"