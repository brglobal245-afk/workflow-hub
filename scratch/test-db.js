import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log('\n--- Logging in first ---');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'hawkindustrypvtltd@gmail.com',
    password: '2452007'
  });

  if (authError) {
    console.error('Failed to log in:', authError.message);
    return;
  }
  console.log('Logged in successfully. User ID:', authData.user.id);

  console.log('\n--- Testing connection to Supabase ---');
  
  // Test employees
  const { data: employees, error: empError } = await supabase.from('employees').select('id, first_name, last_name, email').limit(5);
  if (empError) {
    console.error('Error fetching employees:', empError);
  } else {
    console.log(`Successfully fetched ${employees.length} employees:`, employees);
  }

  // Test roles
  const { data: roles, error: rolesError } = await supabase.from('roles').select('id, name').limit(10);
  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
  } else {
    console.log(`Successfully fetched ${roles.length} roles:`, roles);
  }

  // Test messages
  const { data: messages, error: msgError } = await supabase.from('messages').select('*').limit(5);
  if (msgError) {
    console.error('Error fetching messages:', msgError);
  } else {
    console.log(`Successfully fetched ${messages?.length} messages:`, messages);
  }

  // Test announcements
  const { data: announcements, error: annError } = await supabase.from('announcements').select('*').limit(5);
  if (annError) {
    console.error('Error fetching announcements:', annError);
  } else {
    console.log(`Successfully fetched ${announcements?.length} announcements:`, announcements);
  }

  // Test leadership_messages
  const { data: lm, error: lmError } = await supabase.from('leadership_messages').select('*').limit(5);
  if (lmError) {
    console.error('Error fetching leadership_messages:', lmError);
  } else {
    console.log(`Successfully fetched ${lm?.length} leadership messages:`, lm);
  }
}

runTests();
