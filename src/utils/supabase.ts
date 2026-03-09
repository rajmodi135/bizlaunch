
import { createClient } from '@supabase/supabase-js'

// Replace with your actual project URL from Supabase dashboard
const supabaseUrl = 'https://kygrvjitvehtmhakzamc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5Z3J2aml0dmVodG1oYWt6YW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDE0MzQsImV4cCI6MjA4ODU3NzQzNH0.eLovgFO4kzEvMP1IiuLak_lQLaDNj4GuxH6mRFPCs3I'

export const supabase = createClient(supabaseUrl, supabaseKey)
