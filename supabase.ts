
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwpiagfgcivxwmnkgbrd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cGlhZ2ZnY2l2eHdtbmtnYnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDE0MzUsImV4cCI6MjA4NjkxNzQzNX0.d6Z7J8Cu4Aikirf4r_kYnPPzf5_542pbG1pTh5-3zx8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
