param([string]$Path)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
$entry = $zip.GetEntry("word/document.xml")
if ($entry) {
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $text = $reader.ReadToEnd()
    $reader.Close()
    $entryText = [regex]::Replace($text, "<[^>]+>", " ")
    Write-Output $entryText
} else {
    Write-Error "Could not find word/document.xml in $Path"
}
$zip.Dispose()
