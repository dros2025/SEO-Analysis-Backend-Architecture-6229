import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xcnwlgrszynsrnawrskn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbndsZ3Jzenluc3JuYXdyc2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDU5MzgsImV4cCI6MjA2NjUyMTkzOH0.0kq0VJMjUpOXvdTHpOQFwRRUEoA2bXelibhFuq0Fj6w'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})