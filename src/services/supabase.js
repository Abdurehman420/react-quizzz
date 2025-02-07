import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://fllbidcokmefuhevpamn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGJpZGNva21lZnVoZXZwYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4Mzg1ODAsImV4cCI6MjA1NDQxNDU4MH0.V2N173ktugn1xgBAOTRLYGKO-HmT7YSOGNHVlT5OuAY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
