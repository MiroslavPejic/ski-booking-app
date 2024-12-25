// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Access the environment variables from the .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
