#requires -Version 7
<#
.SYNOPSIS
  First-time migration helper: publish this Astro source to the existing
  PHeonix25/PHeonix25.github.io repo, archiving the Jekyll site on a branch.

.DESCRIPTION
  Runs in two phases. By default it is a DRY RUN — it prints what it would do
  but makes no destructive changes.

  Phase 1 (in the OLD repo at ../PHeonix25.github.io):
    - Verifies the working tree is clean.
    - Creates branch  'archive/jekyll'  pointing at current main.
    - Pushes that branch to origin so the Jekyll history is preserved.

  Phase 2 (in THIS repo):
    - Verifies the local Astro build succeeds.
    - Initialises git here if needed, points origin at PHeonix25.github.io,
      stages everything, commits, and FORCE-PUSHES to main.

  After both phases:
    - Visit https://github.com/PHeonix25/PHeonix25.github.io/settings/pages
      and change Source from 'Deploy from a branch' to 'GitHub Actions'.
    - The deploy workflow at .github/workflows/deploy.yml takes over and the
      custom domain (hermens.com.au) carries over via public/CNAME.

.PARAMETER OldRepoPath
  Path to the existing Jekyll repo. Default: ..\PHeonix25.github.io

.PARAMETER Confirm
  Switch. Required for destructive operations. Without it, the script is a
  dry run that only prints the commands it would execute.

.EXAMPLE
  pwsh .\deploy.ps1
  # Dry run — review the plan.

.EXAMPLE
  pwsh .\deploy.ps1 -Confirm
  # For real. Archives Jekyll, force-pushes Astro source.
#>

[CmdletBinding()]
param(
  [string]$OldRepoPath = (Join-Path $PSScriptRoot '..\PHeonix25.github.io'),
  [switch]$Confirm
)

$ErrorActionPreference = 'Stop'

$here    = $PSScriptRoot
$oldRepo = Resolve-Path -LiteralPath $OldRepoPath -ErrorAction SilentlyContinue
$remote  = 'https://github.com/PHeonix25/PHeonix25.github.io.git'
$prefix  = if ($Confirm) { '[ RUN]' } else { '[DRY]' }
$modeLabel = if ($Confirm) { 'LIVE (will push)' } else { 'DRY RUN (no changes)' }
$modeColor = if ($Confirm) { 'Yellow' } else { 'Green' }

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Run($cmd, $cwd) {
  $where = if ($cwd) { " (in $cwd)" } else { '' }
  Write-Host "$prefix $cmd$where" -ForegroundColor DarkGray
  if (-not $Confirm) { return }
  if ($cwd) { Push-Location $cwd }
  try {
    Invoke-Expression $cmd
    if ($LASTEXITCODE -ne 0) { throw "Command failed (exit $LASTEXITCODE): $cmd" }
  } finally {
    if ($cwd) { Pop-Location }
  }
}

# ── Pre-flight ─────────────────────────────────────────────────────────────
Step 'Pre-flight checks'

if (-not $oldRepo) {
  throw "Old repo not found at: $OldRepoPath. Pass -OldRepoPath if it lives elsewhere."
}
Write-Host "  Old repo (Jekyll): $oldRepo"
Write-Host "  New repo (Astro):  $here"
Write-Host "  Remote:            $remote"
Write-Host "  Mode:              $modeLabel" -ForegroundColor $modeColor

# Old repo should be clean before we branch off it.
Push-Location $oldRepo
$oldStatus = git status --porcelain
Pop-Location
if ($oldStatus) {
  throw "Old repo has uncommitted changes. Commit or stash them first:`n$oldStatus"
}

# Local build must succeed before we publish anything.
Step 'Local build smoke test'
Run 'npm run build' $here

# ── Phase 1: archive the Jekyll site ───────────────────────────────────────
Step 'Phase 1: archive Jekyll on archive/jekyll branch'

Run "git checkout main"                                  $oldRepo
Run "git pull --ff-only origin main"                     $oldRepo
Run "git branch -f archive/jekyll main"                  $oldRepo
Run "git push origin archive/jekyll"                     $oldRepo

# ── Phase 2: publish the Astro source ──────────────────────────────────────
Step 'Phase 2: publish Astro source to main'

$hasGit = Test-Path (Join-Path $here '.git')
if (-not $hasGit) {
  Run 'git init -b main'                                 $here
  Run "git remote add origin $remote"                    $here
} else {
  # Make sure origin points at the right place.
  Run "git remote set-url origin $remote"                $here
}

Run 'git add -A'                                         $here
Run "git commit -m 'Astro 6 rebuild: replace Jekyll site'" $here
Run 'git push --force-with-lease origin main'            $here

# ── Post-flight ────────────────────────────────────────────────────────────
Step 'Manual steps remaining'

Write-Host @'
  1. Open: https://github.com/PHeonix25/PHeonix25.github.io/settings/pages
  2. Under "Build and deployment > Source", choose: GitHub Actions
  3. Confirm custom domain still reads: hermens.com.au
  4. Watch the deploy:
       https://github.com/PHeonix25/PHeonix25.github.io/actions
  5. After the workflow completes, hard-refresh https://hermens.com.au
     and verify:
       - the new layout loads
       - /writing, /speaking, /archive, /about all work
       - /feed.xml is valid XML
       - DNS / custom domain still resolves

  Rollback (if needed):
     git push --force-with-lease origin archive/jekyll:main
     ... then switch Pages source back to "Deploy from a branch".
'@ -ForegroundColor Yellow

if (-not $Confirm) {
  Write-Host "`nDry run complete. Re-run with -Confirm to execute." -ForegroundColor Green
} else {
  Write-Host "`nDone. Track the deploy in GitHub Actions." -ForegroundColor Green
}
