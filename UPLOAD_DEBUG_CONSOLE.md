# Upload Debugging Commands

Run these in browser console (F12 → Console tab) to debug upload issues:

## Test 1: Check Supabase Connection
```javascript
// Check if Supabase client is initialized
import { supabase } from './supabaseClient';
const { data, error } = await supabase.from('media').select('*').limit(1);
console.log('Supabase test:', { data, error });
```

## Test 2: Check Table Structure
```javascript
// Verify media table exists and has correct columns
const { data, error } = await supabase
  .from('media')
  .select('*')
  .limit(1);
console.log('Table structure test:', { data, error });
```

## Test 3: Insert Test Data
```javascript
// Try inserting a test record
const { data, error } = await supabase
  .from('media')
  .insert([{
    id: 'test-' + Date.now(),
    type: 'image',
    url: 'test-url',
    thumbnail: 'test-url',
    title: 'Test Photo',
    date: new Date().toISOString(),
    description: 'Test',
    aspect_ratio: 'aspect-square',
    uploaded_by: 'test-user',
    created_at: new Date().toISOString(),
    liked: false,
    poetic_caption: null,
  }])
  .select()
  .single();
console.log('Insert test:', { data, error });
```

## Test 4: Check RLS Status
```javascript
// Query to check RLS status
const { data, error } = await supabase.rpc('check_rls_enabled');
console.log('RLS status:', { data, error });
```

## Test 5: List All Policies
```javascript
// See all RLS policies on media table (if any)
const { data, error } = await supabase
  .from('pg_policies')
  .select('*')
  .eq('tablename', 'media');
console.log('Policies:', { data, error });
```

## What Each Test Tells You

| Test | Success Means | Failure Means |
|------|---------------|---------------|
| Test 1 | Supabase connected | Can't reach Supabase |
| Test 2 | Table exists | Table not created |
| Test 3 | Can insert data | RLS blocking or permissions issue |
| Test 4 | RLS status visible | Need different query |
| Test 5 | See any policies | No policies or query not working |

## Common Responses

### ✅ Working (RLS Disabled)
```javascript
{ 
  data: [{...}], 
  error: null 
}
```

### ❌ RLS Blocking
```javascript
{
  data: null,
  error: {
    code: "42501",
    message: "new row violates row-level security policy"
  }
}
```

### ❌ Table Doesn't Exist
```javascript
{
  data: null,
  error: {
    code: "42P01",
    message: "relation \"media\" does not exist"
  }
}
```

### ❌ Bad Connection
```javascript
{
  data: null,
  error: {
    code: "ECONNREFUSED",
    message: "Failed to fetch"
  }
}
```

## Copy-Paste Test

Run this in browser console to get all info at once:

```javascript
(async () => {
  console.log('=== UPLOAD DEBUG TEST ===');
  
  // Test connection
  const { data: d1, error: e1 } = await supabase.from('media').select('*').limit(1);
  console.log('Connection:', e1 ? '❌ FAIL' : '✅ OK');
  if(e1) console.error('Error:', e1);
  
  // Test insert
  const { data: d2, error: e2 } = await supabase
    .from('media')
    .insert([{
      id: 'debug-' + Date.now(),
      type: 'image',
      url: 'test',
      thumbnail: 'test',
      title: 'Debug Test',
      date: new Date().toISOString(),
      description: 'Testing',
      aspect_ratio: 'aspect-square',
      uploaded_by: 'debug',
      created_at: new Date().toISOString(),
      liked: false,
      poetic_caption: null
    }])
    .select()
    .single();
  console.log('Insert:', e2 ? '❌ FAIL' : '✅ OK');
  if(e2) console.error('Error:', e2);
  
  // Summary
  console.log('=== RESULT ===');
  if(!e1 && !e2) console.log('✅ EVERYTHING WORKING!');
  else console.log('❌ ISSUE FOUND - See errors above');
})();
```

## If You See These Errors

### "relation "media" does not exist"
→ Run SUPABASE_SETUP.sql in Supabase dashboard

### "new row violates row-level security policy"
→ Run this: `ALTER TABLE media DISABLE ROW LEVEL SECURITY;`

### "Failed to fetch"
→ Check .env.local for correct Supabase credentials

### "permission denied"
→ Check Supabase API key has right permissions

## After Running Tests

1. Screenshot or copy the output
2. Check if it matches ✅ or ❌ patterns
3. Follow the solution for your error
4. Try uploading again
5. Check console for "Media saved successfully"
