# How to Add Your Logo and Background Image

## Quick Steps:

### 1. Find Your Files
- Locate your logo file (any image from your Pictures folder)
- Locate your `imagecopy.png` file

### 2. Copy to the Project

Simply copy both files to the assets folder:

**Location:** `d:\hackone\nfsu-complaint-portal\client\public\assets\`

**File names to use:**
- Your logo → rename to: `logo.png`
- imagecopy.png → rename to: `background.png`

### 3. Using File Explorer:

1. Open File Explorer
2. Navigate to: `d:\hackone\nfsu-complaint-portal\client\public\assets\`
3. Copy your logo file there and rename it to `logo.png`
4. Copy your background file there and rename it to `background.png`

### 4. Refresh Your Browser

After copying the files, just refresh your browser (F5) and you'll see:
- Your logo in the top-left corner of login/register pages
- Your background image on login/register pages

---

## Testing Complaint Submission

I've added detailed error logging to help us find the issue. When you try to submit a complaint:

1. Open browser Developer Tools (F12)
2. Go to the "Console" tab
3. Try to submit a complaint
4. You'll see detailed logs showing exactly what's happening
5. Share any error messages you see in the console

The console will show:
- What data is being sent
- Any errors from the server
- Alert messages with specific error details

This will help us fix the complaint submission issue quickly!

---

## If the Images Don't Show

Don't worry! The app works perfectly fine without them - you'll just see:
- An "N" letter logo placeholder
- The nice gradient background instead of your custom image

The functionality remains 100% the same!
