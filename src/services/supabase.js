import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://yiddftpjhsmxswosuqxw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZGRmdHBqaHNteHN3b3N1cXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMjMzMDksImV4cCI6MjAyODg5OTMwOX0.xpfxDXxUnazvSTiS0_mCvnaQAvAJTi6o6-JD_VzdPX4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
