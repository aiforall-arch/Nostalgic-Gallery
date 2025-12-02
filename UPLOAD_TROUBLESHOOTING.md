# 🐛 Photo Upload Troubleshooting Guide

## Problem: Photos Not Getting Uploaded

### What I Fixed:

1. **Image Loading Issue** ✅
   - Fixed async image loading in upload handler
   - Added proper error handling with Promise
   - Image dimensions now correctly calculated before save

2. **Supabase Save Failure** ✅
   - Added detailed console logging
   - Better error messages for debugging
   - User-facing alerts on failure

3. **Error Feedback** ✅
   - Alert messages now show actual errors
   - Console logs all steps in the process
   - Easy to debug what went wrong

---

## 🧪 How to Debug Upload Issues

### Step 1: Check Browser Console
```
Press F12 → Console tab → Try uploading a photo
Look for these messages:
- "Saving media to Supabase: ..." ← Upload started
- "Media saved successfully: ..." ← Upload succeeded
- "Upload failed: ..." ← Shows the error
```

### Step 2: Check Network Tab
```
Press F12 → Network tab → Try uploading
Look for requests to: api.supabase.co
Check if response status is 200/201 (success) or 400/403 (error)
Click on the request to see response details
```

### Step 3: Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `RLS violation` | RLS policies blocking INSERT | Run: `ALTER TABLE media DISABLE ROW LEVEL SECURITY;` |
| `Permission denied` | Insufficient access | Check Supabase API key in supabaseClient.ts |
| `Column does not exist` | Missing table columns | Run SUPABASE_SETUP.sql again |
| `Invalid JSON` | Data format issue | Check MediaItem type matches database |
| `Failed to load image` | Bad image file | Try a different image file |

---

## 📋 Debugging Checklist

Before assuming there's a bug, check these:

- [ ] Are you logged in? (Name shows in top-right)
- [ ] Did you select an image file?
- [ ] Did you enter a title?
- [ ] Is the preview showing?
- [ ] Did you click "Add Memory" button?
- [ ] Check console for error messages (F12)
- [ ] Check Supabase dashboard for the table data
- [ ] Verify .env.local has GEMINI_API_KEY

---

## 🔍 What the Upload Process Does

```
1. User selects image
   ↓
2. FileReader converts to base64 (previewUrl)
   ↓
3. User clicks "Add Memory"
   ↓
4. Image dimensions are detected
   ↓
5. MediaItem object is created with:
   - id (timestamp)
   - title, description
   - url (base64 string)
   - thumbnail (same as url)
   - aspectRatio (calculated)
   - uploadedBy (user email/phone)
   ↓
6. Sent to Supabase mediaService.saveMedia()
   ↓
7. Supabase inserts into 'media' table
   ↓
8. If successful: photo appears in gallery
   If failed: alert shows error
```

---

## 💾 Where Photos Are Stored

**Current Implementation** (Data URIs):
- Photos stored as base64 in Supabase
- Pros: Simple, works offline
- Cons: Larger database, slower with large photos

**Future Improvement** (Supabase Storage):
```typescript
// Upload to Supabase Storage instead of storing as base64
const { data, error } = await supabase.storage
  .from('media')
  .upload(`${Date.now()}.jpg`, file);
```

---

## 🆘 If Upload Still Fails

### Check #1: Supabase Table Structure
```sql
-- Go to Supabase Dashboard → SQL Editor → Run:
SELECT * FROM media LIMIT 1;
-- If error: "relation does not exist", table wasn't created
-- Solution: Run SUPABASE_SETUP.sql
```

### Check #2: RLS Status
```sql
-- Check if RLS is disabled:
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'media';
-- Should show: relrowsecurity = false

-- If true, run:
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
```

### Check #3: Supabase Connection
```typescript
// In browser console, test Supabase:
import { supabase } from './supabaseClient';
const { data, error } = await supabase.from('media').select('*').limit(1);
console.log(data, error);
// Should return array or null, not error
```

---

## 📊 Console Output Examples

### ✅ Successful Upload
```
Saving media to Supabase: {
  id: "1733177234567",
  title: "My Photo",
  url: "data:image/jpeg;base64,...",
  ...
}
Media saved successfully: {
  id: "1733177234567",
  ...
}
```

### ❌ Failed Upload
```
Saving media to Supabase: {...}
Supabase error saving media: {
  code: "23505",
  message: "duplicate key value violates unique constraint",
  ...
}
Upload failed: Error saving to database
```

---

## 🛠️ Code Changes Made

### Gallery.tsx
- Fixed async image loading with Promise
- Added error handling for image errors
- Improved error messages to user
- Added detailed console logging

### mediaService.ts
- Enhanced error logging
- Shows specific Supabase error codes
- Logs all steps in save process
- Better debugging information

---

## ✅ After Fix - Expected Behavior

1. **Upload photo**
   - See loading spinner ✅
   - Photo appears in gallery ✅
   - Console shows success message ✅

2. **Refresh page**
   - Photo still appears ✅
   - Data persisted to Supabase ✅

3. **Logout and login**
   - Photo still there ✅
   - Persisted across sessions ✅

4. **Like and caption**
   - Like status saved ✅
   - AI caption saved ✅
   - All data persists ✅

---

## 🚀 Testing the Upload

### Quick Test (2 minutes)
```
1. npm run dev
2. http://localhost:5173
3. Click "Enter Gallery"
4. Click "+ Add Memory"
5. Select a photo (JPG/PNG)
6. Enter title
7. Click "Add Memory"
8. Check console (F12) for success/error message
```

### Full Test (5 minutes)
```
1. Upload photo (see it appear)
2. Like it (heart fills)
3. Add AI caption (Reminisce button)
4. Refresh page (Ctrl+R)
5. Photo + like + caption still there? ✅
6. Logout
7. Login
8. Photo still there? ✅
```

---

## 📞 If Still Not Working

1. **First**: Check browser console (F12 → Console)
2. **Read the error**: Copy and understand it
3. **Search**: Look in this guide for that error
4. **Try**: Follow the solution
5. **Verify**: Check Supabase dashboard directly

---

## 🎯 Key Points to Remember

- ✅ RLS must be DISABLED for this demo
- ✅ Photos stored as base64 (OK for small gallery)
- ✅ Supabase connection required
- ✅ Check console for actual error messages
- ✅ Refresh Supabase dashboard to see new data

---

## 📝 Next Steps

After upload works:
1. Add theme image to UI
2. Test on mobile
3. Optional: Move photos to Supabase Storage
4. Deploy to production

Good luck! Check the console for detailed error info. 🚀
