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
CREATE POLICY "Allow all read" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON employees FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON employees FOR DELETE USING (true);

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
-- Automated Profile Generation trigger (handles Sign Up cleanly)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.employees (id, first_name, last_name, email, employee_id, role_id, position, status, joining_date, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'Employee'),
    new.email,
    'ACM-' || floor(random() * 9000 + 1000)::text,
    'r7', -- Default role is 'Employee'
    'New Employee',
    'active',
    to_char(now(), 'YYYY-MM-DD'),
    'blue'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
