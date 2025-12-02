# Troubleshooting & Customization Guide

## 🔧 Supabase Data Persistence Fix

If data isn't persisting in Supabase, run this updated SQL in your Supabase Dashboard:

```sql
-- Disable RLS for simpler public access
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
```

This disables Row Level Security which was preventing writes. If you prefer RLS, enable it and ensure these policies exist:
- `Allow public read` - SELECT
- `Allow public insert` - INSERT  
- `Allow public update` - UPDATE (for likes and captions)
- `Allow public delete` - DELETE

## 🎨 Adding Theme Images

You can customize the background in several ways:

### Option 1: Use a Custom Image (Easy)
Replace the background in `index.css` with your image:

```css
body {
  background-image: url('your-image-url.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
```

### Option 2: Add Image to Public Folder
1. Place your image in `public/` folder (create if needed)
2. Update `index.css`:

```css
body {
  background-image: url('/theme-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
}
```

### Option 3: Use Supabase Storage (Best for Large Images)
1. Upload image to Supabase Storage
2. Get the public URL
3. Use in `index.css`:

```css
body {
  background-image: url('https://your-supabase-url.com/storage/v1/object/public/images/theme-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
}
```

### Option 4: Customize Per Component
You can add background images to specific components:

```tsx
// In Gallery.tsx or any component
<div style={{
  backgroundImage: 'url(your-image)',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed'
}}>
  {/* Your content */}
</div>
```

## 🖼️ Recommended Theme Images

- **Vintage Film Texture**: Search for "film grain" or "old photo texture"
- **Nostalgic Patterns**: Search for "vintage wallpaper" or "retro pattern"
- **Photo Paper**: Search for "aged paper texture" or "photo paper background"
- **Faded Colors**: Use warm, muted tones matching your palette (cream, sienna, gold)

## 📸 Image Optimization Tips

- Keep file size under 500KB (use tools like TinyPNG)
- Use format: JPEG or WebP for photos, PNG for transparent overlays
- Aspect ratio: 16:9 or full screen sized
- Color: Warm, nostalgic tones (beige, cream, faded colors)

## ✅ Testing Your Changes

1. Run: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Check that:
   - Background image loads
   - Data persists after logout/login
   - Likes and captions save properly
   - Admin dashboard shows all details

## 🆘 If Data Still Isn't Saving

Check browser console (F12) for errors:
1. Go to Developer Tools → Console tab
2. Try uploading a photo or liking an item
3. Look for red error messages
4. Common issues:
   - CORS errors: Check Supabase API settings
   - RLS denied: Run the SQL fix above
   - API key invalid: Verify `GEMINI_API_KEY` in `.env.local`

## 📝 Example: Adding a Subtle Pattern Overlay

If you want a pattern overlay over your theme:

```css
body {
  background-color: #fdf6f0;
  background-image: 
    linear-gradient(45deg, rgba(0,0,0,.01) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0,0,0,.01) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0,0,0,.01) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0,0,0,.01) 75%);
  background-size: 50px 50px;
  background-position: 0 0, 0 25px, 25px -25px, -25px 0px;
}
```

Adjust the opacity (0.01) and size (50px) to your preference!
