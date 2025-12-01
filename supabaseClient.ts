import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qcbefqifuffuoeegmjvo.supabase.co'; // your project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjYmVmcWlmdWZmdW9lZWdtanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODE5NjksImV4cCI6MjA3OTc1Nzk2OX0.P-kdacVVcZH0YUtrKVyPhtMvlHixyG6SeBrhgwepYag';            // from Supabase → Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
