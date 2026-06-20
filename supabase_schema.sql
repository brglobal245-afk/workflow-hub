-- ============================================================
-- WORKFLOW HUB — Supabase Database Schema & Seed Data
-- Run this in your Supabase project SQL Editor
-- ============================================================

-- 1. Enable pgcrypto extension for user password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS performance_goals CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS leaves CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS leadership_messages CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 3. Create Roles table
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  authority_level INTEGER NOT NULL,
  color TEXT NOT NULL,
  permissions TEXT[] NOT NULL,
  description TEXT
);

-- 4. Create Departments table
CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  head_id UUID,
  description TEXT,
  status TEXT DEFAULT 'active',
  budget TEXT
);

-- 5. Create Teams table
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  leader_id UUID,
  color TEXT,
  description TEXT
);

-- 6. Create Employees table (profiles linked to Supabase auth.users)
CREATE TABLE employees (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  role_id TEXT REFERENCES roles(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  type TEXT DEFAULT 'Full Time',
  joining_date TEXT,
  phone TEXT,
  avatar_url TEXT,
  skills TEXT[],
  bio TEXT,
  position TEXT,
  location TEXT
);

-- Add head/leader constraints referencing employees
ALTER TABLE departments ADD CONSTRAINT fk_departments_head FOREIGN KEY (head_id) REFERENCES employees(id) ON DELETE SET NULL;
ALTER TABLE teams ADD CONSTRAINT fk_teams_leader FOREIGN KEY (leader_id) REFERENCES employees(id) ON DELETE SET NULL;

-- 7. Create Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  deadline TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  creator_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  comments_count INTEGER DEFAULT 0,
  attachments_count INTEGER DEFAULT 0,
  notes TEXT,
  submission_notes TEXT
);

-- 8. Create Messages table (Private chats)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'text',
  group_id TEXT
);

-- 9. Create Leadership Messages table (Private feedback/complaints)
CREATE TABLE leadership_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'suggestion',
  priority TEXT DEFAULT 'normal',
  sent_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'unread',
  response TEXT
);

-- 10. Create Announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  date TEXT NOT NULL,
  author_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  pinned BOOLEAN DEFAULT false,
  reads INTEGER DEFAULT 0
);

-- 11. Create Attendance table
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT,
  status TEXT NOT NULL,
  type TEXT DEFAULT 'office',
  break_start TEXT,
  break_end TEXT,
  break_minutes INTEGER DEFAULT 0
);

-- 12. Create Leaves table
CREATE TABLE leaves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  applied_date TEXT NOT NULL,
  rejection_reason TEXT,
  approver_id UUID REFERENCES employees(id) ON DELETE SET NULL
);

-- 13. Create Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  uploaded_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  url TEXT,
  access_level TEXT DEFAULT 'all'
);

-- 14. Create Performance Goals table
CREATE TABLE performance_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kpi TEXT,
  target INTEGER DEFAULT 100,
  current INTEGER DEFAULT 0,
  due_date TEXT,
  status TEXT DEFAULT 'on_track'
);

-- 15. Create Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) policies for development convenience
-- ============================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin write" ON roles FOR ALL TO authenticated USING (true);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON departments FOR ALL TO authenticated USING (true);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON teams FOR ALL TO authenticated USING (true);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read" ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow self update" ON employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow write" ON employees FOR ALL TO authenticated USING (true);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON tasks FOR ALL TO authenticated USING (true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read self" ON messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Allow insert self" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Allow update self" ON messages FOR UPDATE TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

ALTER TABLE leadership_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read self LM" ON leadership_messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Allow write LM" ON leadership_messages FOR ALL TO authenticated USING (true);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON announcements FOR ALL TO authenticated USING (true);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write self" ON attendance FOR ALL TO authenticated USING (auth.uid() = user_id);

ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON leaves FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON leaves FOR ALL TO authenticated USING (true);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON documents FOR ALL TO authenticated USING (true);

ALTER TABLE performance_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON performance_goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write" ON performance_goals FOR ALL TO authenticated USING (true);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read self" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow write" ON notifications FOR ALL TO authenticated USING (true);

-- ============================================================
-- Seeding Initial Roles & Static Config
-- ============================================================
INSERT INTO roles (id, name, authority_level, color, permissions, description) VALUES
('r1', 'Organization Admin', 100, '#4f46e5', ARRAY['create_user', 'edit_user', 'suspend_user', 'delete_user', 'view_all_users', 'create_role', 'assign_role', 'edit_role', 'delete_role', 'create_department', 'edit_department', 'delete_department', 'view_department', 'create_team', 'edit_team', 'delete_team', 'manage_team_members', 'create_task', 'assign_task', 'review_task', 'delete_task', 'view_all_tasks', 'send_messages', 'create_groups', 'broadcast_announcements', 'message_leadership', 'view_reports', 'export_reports', 'view_all_reports', 'manage_org_settings', 'manage_security_settings', 'manage_leave_types', 'approve_leave', 'view_all_attendance', 'manage_documents', 'view_all_documents', 'review_performance', 'view_all_performance'], 'Full administrative access to the organization'),
('r2', 'Department Head', 80, '#0891b2', ARRAY['view_all_users', 'edit_user', 'create_team', 'edit_team', 'manage_team_members', 'view_department', 'edit_department', 'create_task', 'assign_task', 'review_task', 'view_all_tasks', 'send_messages', 'create_groups', 'broadcast_announcements', 'view_reports', 'export_reports', 'approve_leave', 'view_all_attendance', 'view_all_documents', 'review_performance', 'view_all_performance'], 'Leads an entire department'),
('r3', 'Manager', 70, '#059669', ARRAY['view_all_users', 'manage_team_members', 'view_department', 'create_task', 'assign_task', 'review_task', 'view_all_tasks', 'send_messages', 'create_groups', 'view_reports', 'approve_leave', 'view_all_attendance', 'review_performance'], 'Manages a team or project'),
('r4', 'Team Lead', 60, '#7c3aed', ARRAY['view_all_users', 'view_department', 'create_task', 'assign_task', 'review_task', 'send_messages', 'create_groups', 'view_reports', 'approve_leave'], 'Leads a sub-team'),
('r5', 'HR Manager', 75, '#db2777', ARRAY['create_user', 'edit_user', 'suspend_user', 'assign_role', 'view_all_users', 'view_department', 'create_task', 'assign_task', 'send_messages', 'broadcast_announcements', 'view_reports', 'export_reports', 'view_all_reports', 'approve_leave', 'manage_leave_types', 'view_all_attendance', 'manage_documents', 'view_all_documents', 'review_performance', 'view_all_performance'], 'Manages human resources and personnel'),
('r6', 'Senior Employee', 40, '#0284c7', ARRAY['view_all_users', 'view_department', 'create_task', 'send_messages', 'message_leadership', 'view_reports'], 'Experienced team member with elevated access'),
('r7', 'Employee', 20, '#64748b', ARRAY['view_department', 'send_messages', 'message_leadership'], 'Standard employee'),
('r8', 'Intern', 5, '#f59e0b', ARRAY['send_messages'], 'Temporary intern with minimal access');

-- Seeding Departments
INSERT INTO departments (id, name, emoji, color, head_id, description, status, budget) VALUES
('d1', 'Engineering', '⚙️', '#4f46e5', NULL, 'Product development, infrastructure, and technical operations', 'active', '$2.4M'),
('d2', 'Human Resources', '👥', '#db2777', NULL, 'Talent acquisition, employee relations, and HR policies', 'active', '$450K'),
('d3', 'Marketing', '📢', '#7c3aed', NULL, 'Brand management, digital marketing, and campaigns', 'active', '$800K'),
('d4', 'Sales', '💼', '#059669', NULL, 'Revenue generation, client acquisition, and account management', 'active', '$1.1M'),
('d5', 'Operations', '🏢', '#0891b2', NULL, 'Business operations, process management, and logistics', 'active', '$600K'),
('d6', 'Finance', '💰', '#d97706', NULL, 'Financial planning, accounting, and reporting', 'active', '$300K');

-- Seeding Teams
INSERT INTO teams (id, department_id, name, leader_id, color, description) VALUES
('t1', 'd1', 'Frontend Team', NULL, '#4f46e5', 'Web application interface and user experience development'),
('t2', 'd1', 'Backend Team', NULL, '#10b981', 'API development, databases, and server-side development'),
('t3', 'd1', 'DevOps Team', NULL, '#f59e0b', 'Infrastructure, CI/CD, and cloud operations'),
('t4', 'd2', 'HR Team', NULL, '#ec4899', 'Recruitment and employee management'),
('t5', 'd3', 'Content & Brand', NULL, '#8b5cf6', 'Content creation and brand strategy'),
('t6', 'd4', 'Enterprise Sales', NULL, '#10b981', 'B2B sales and enterprise accounts');

-- ============================================================
-- Seeding Auth Users in Supabase
-- Note: Encrypted passwords are all "Password123!" using standard bcrypt salt
-- ============================================================
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alexandra.chen@acmetech.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marcus.rodriguez@acmetech.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah.kim@acmetech.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'priya.sharma@acmetech.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a5', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'james.patel@acmetech.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

-- ============================================================
-- Seeding Employee Profiles linking to Auth Users
-- ============================================================
INSERT INTO employees (id, first_name, last_name, email, employee_id, department_id, team_id, role_id, manager_id, status, type, joining_date, phone, avatar_url, skills, bio, position, location) VALUES
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a1', 'Alexandra', 'Chen', 'alexandra.chen@acmetech.com', 'ACM-001', NULL, NULL, 'r1', NULL, 'active', 'Full Time', '2019-01-15', '+1 (555) 001-0001', 'blue', ARRAY['React', 'Architecture', 'Strategy'], 'Founder and Chief Architect. Building the future of workplace management.', 'Organization Administrator', 'San Francisco, CA'),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a2', 'Marcus', 'Rodriguez', 'marcus.rodriguez@acmetech.com', 'ACM-002', 'd1', 't3', 'r2', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a1', 'active', 'Full Time', '2019-03-01', '+1 (555) 001-0002', 'green', ARRAY['Cloud', 'Kubernetes', 'Leadership'], 'Engineering Department Head. Dedicated to robust and scalable architectures.', 'VP of Engineering', 'San Francisco, CA'),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a3', 'Sarah', 'Kim', 'sarah.kim@acmetech.com', 'ACM-003', 'd1', 't1', 'r4', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a2', 'active', 'Full Time', '2020-06-15', '+1 (555) 001-0003', 'purple', ARRAY['Javascript', 'CSS', 'UI/UX'], 'Frontend Team Lead. Design system enthusiast and user experience advocate.', 'Frontend Team Lead', 'Austin, TX'),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a4', 'Priya', 'Sharma', 'priya.sharma@acmetech.com', 'ACM-006', 'd2', 't4', 'r5', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a1', 'active', 'Full Time', '2019-08-20', '+1 (555) 001-0006', 'pink', ARRAY['Sourcing', 'Employee Relations', 'HR Tech'], 'HR Manager. Passionate about company culture and employee growth.', 'HR Manager', 'San Francisco, CA'),
('e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a5', 'James', 'Patel', 'james.patel@acmetech.com', 'ACM-004', 'd1', 't1', 'r6', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a3', 'active', 'Full Time', '2021-02-01', '+1 (555) 001-0004', 'orange', ARRAY['React', 'HTML', 'Git'], 'Software Engineer. Building modular UI components and core platform features.', 'Senior Frontend Engineer', 'New York, NY');

-- Link head/leader IDs
UPDATE departments SET head_id = 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a2' WHERE id = 'd1';
UPDATE departments SET head_id = 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a4' WHERE id = 'd2';
UPDATE teams SET leader_id = 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a3' WHERE id = 't1';

-- Seeding Tasks
INSERT INTO tasks (title, description, priority, status, progress, deadline, creator_id, assignee_id, team_id, department_id) VALUES
('Migrate Database to Supabase', 'Set up tables, RLS policy structures, trigger mechanisms, and seeds.', 'critical', 'in_progress', 40, '2026-06-30', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a1', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a2', NULL, 'd1'),
('Design Landing Page Layout', 'Build wireframes, configure color schemes, and write basic styles.', 'medium', 'completed', 100, '2026-06-15', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a3', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a5', 't1', 'd1'),
('Update Employee Handbook', 'Review policy drafts, check security rules, and submit handbook updates.', 'low', 'not_started', 0, '2026-07-10', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a4', 'e2a9b2b5-5c1a-4d7a-8fbb-57ffec2882a4', 't4', 'd2');
