import { createClient } from "@supabase/supabase-js";

export type Database = {
  id?: number;
  lunch: string;
  created_at?: string;
  isDone: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "";

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
