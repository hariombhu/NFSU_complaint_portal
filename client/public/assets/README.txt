# Asset Files Instructions

## To Add Your Logo and Background:

1. **Copy your logo** from your Pictures folder to:
   `nfsu-complaint-portal\photo\logo.png`

2. **Copy imagecopy.png** to:
   `nfsu-complaint-portal\photo\image copy.png`

The application will automatically use these files once you place them in the assets folder.

## Quick Copy Commands:

```powershell
# Replace these paths with your actual file locations

# Copy logo
Copy-Item "C:\Users\HP\Pictures\your-logo.png" "d:\hackone\nfsu-complaint-portal\client\public\assets\logo.png"

# Copy background
Copy-Item "path\to\imagecopy.png" "d:\hackone\nfsu-complaint-portal\client\public\assets\background.png"
```
