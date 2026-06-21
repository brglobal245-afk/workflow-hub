-- =========================================================================
-- WORKFLOW HUB — Migration: Enable Multi-Tenancy (Org Data Separation)
-- Copy and paste this entire block into your Supabase SQL Editor and run it
-- =========================================================================

-- 1. Create Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert fallback/demo organization for existing database records
INSERT INTO public.organizations (id, name)
VALUES ('ORG-DEMO', 'Acme Technologies')
ON CONFLICT (id) DO NOTHING;

-- 2. Add org_id to existing tables linking them to the organizations table
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.leadership_messages ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.leaves ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.performance_goals ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS org_id TEXT REFERENCES public.organizations(id) ON DELETE SET NULL DEFAULT 'ORG-DEMO';

-- 3. Define helper function get_user_org_id to bypass recursion limits in RLS check
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS text AS $$
DECLARE
  v_org_id text;
BEGIN
  -- Run with Postgres administrative privilege (SECURITY DEFINER) to bypass RLS recursion check
  SELECT org_id INTO v_org_id FROM public.employees WHERE id = auth.uid();
  RETURN COALESCE(v_org_id, 'ORG-DEMO');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Define automatic setting of org_id trigger on inserts
CREATE OR REPLACE FUNCTION public.set_org_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.org_id IS NULL THEN
    NEW.org_id := public.get_user_org_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach triggers to automatically set org_id for all inserts
DROP TRIGGER IF EXISTS tr_set_org_id_departments ON public.departments;
CREATE TRIGGER tr_set_org_id_departments BEFORE INSERT ON public.departments FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_teams ON public.teams;
CREATE TRIGGER tr_set_org_id_teams BEFORE INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_tasks ON public.tasks;
CREATE TRIGGER tr_set_org_id_tasks BEFORE INSERT ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_messages ON public.messages;
CREATE TRIGGER tr_set_org_id_messages BEFORE INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_leadership_messages ON public.leadership_messages;
CREATE TRIGGER tr_set_org_id_leadership_messages BEFORE INSERT ON public.leadership_messages FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_announcements ON public.announcements;
CREATE TRIGGER tr_set_org_id_announcements BEFORE INSERT ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_attendance ON public.attendance;
CREATE TRIGGER tr_set_org_id_attendance BEFORE INSERT ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_leaves ON public.leaves;
CREATE TRIGGER tr_set_org_id_leaves BEFORE INSERT ON public.leaves FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_documents ON public.documents;
CREATE TRIGGER tr_set_org_id_documents BEFORE INSERT ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_performance_goals ON public.performance_goals;
CREATE TRIGGER tr_set_org_id_performance_goals BEFORE INSERT ON public.performance_goals FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_notifications ON public.notifications;
CREATE TRIGGER tr_set_org_id_notifications BEFORE INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

DROP TRIGGER IF EXISTS tr_set_org_id_roles ON public.roles;
CREATE TRIGGER tr_set_org_id_roles BEFORE INSERT ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_org_id();

-- 5. Enable and Update RLS policies to isolate by organization
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read public.organizations" ON public.organizations;
CREATE POLICY "Allow read public.organizations" ON public.organizations FOR SELECT TO authenticated USING (true);

-- Employees table RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read" ON public.employees;
DROP POLICY IF EXISTS "Allow all insert" ON public.employees;
DROP POLICY IF EXISTS "Allow all update" ON public.employees;
DROP POLICY IF EXISTS "Allow all delete" ON public.employees;
DROP POLICY IF EXISTS "Org isolation select employees" ON public.employees;
CREATE POLICY "Org isolation select employees" ON public.employees FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation insert employees" ON public.employees;
CREATE POLICY "Org isolation insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation update employees" ON public.employees;
CREATE POLICY "Org isolation update employees" ON public.employees FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation delete employees" ON public.employees;
CREATE POLICY "Org isolation delete employees" ON public.employees FOR DELETE TO authenticated USING (org_id = public.get_user_org_id());

-- Departments table RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read" ON public.departments;
DROP POLICY IF EXISTS "Allow write" ON public.departments;
DROP POLICY IF EXISTS "Org isolation select departments" ON public.departments;
CREATE POLICY "Org isolation select departments" ON public.departments FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write departments" ON public.departments;
CREATE POLICY "Org isolation write departments" ON public.departments FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Teams table RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read" ON public.teams;
DROP POLICY IF EXISTS "Allow write" ON public.teams;
DROP POLICY IF EXISTS "Org isolation select teams" ON public.teams;
CREATE POLICY "Org isolation select teams" ON public.teams FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write teams" ON public.teams;
CREATE POLICY "Org isolation write teams" ON public.teams FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Tasks table RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read" ON public.tasks;
DROP POLICY IF EXISTS "Allow write" ON public.tasks;
DROP POLICY IF EXISTS "Org isolation select tasks" ON public.tasks;
CREATE POLICY "Org isolation select tasks" ON public.tasks FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write tasks" ON public.tasks;
CREATE POLICY "Org isolation write tasks" ON public.tasks FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Messages table RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read self" ON public.messages;
DROP POLICY IF EXISTS "Allow insert self" ON public.messages;
DROP POLICY IF EXISTS "Allow update self" ON public.messages;
DROP POLICY IF EXISTS "Org isolation select messages" ON public.messages;
CREATE POLICY "Org isolation select messages" ON public.messages FOR SELECT TO authenticated USING (org_id = public.get_user_org_id() AND (auth.uid() = sender_id OR auth.uid() = recipient_id));
DROP POLICY IF EXISTS "Org isolation insert messages" ON public.messages;
CREATE POLICY "Org isolation insert messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id() AND auth.uid() = sender_id);
DROP POLICY IF EXISTS "Org isolation update messages" ON public.messages;
CREATE POLICY "Org isolation update messages" ON public.messages FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id() AND (auth.uid() = sender_id OR auth.uid() = recipient_id));

-- Leadership Messages table RLS
ALTER TABLE public.leadership_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read self LM" ON public.leadership_messages;
DROP POLICY IF EXISTS "Allow write LM" ON public.leadership_messages;
DROP POLICY IF EXISTS "Org isolation select LM" ON public.leadership_messages;
CREATE POLICY "Org isolation select LM" ON public.leadership_messages FOR SELECT TO authenticated USING (org_id = public.get_user_org_id() AND (auth.uid() = sender_id OR auth.uid() = recipient_id));
DROP POLICY IF EXISTS "Org isolation write LM" ON public.leadership_messages;
CREATE POLICY "Org isolation write LM" ON public.leadership_messages FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Announcements table RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read" ON public.announcements;
DROP POLICY IF EXISTS "Allow write" ON public.announcements;
DROP POLICY IF EXISTS "Org isolation select announcements" ON public.announcements;
CREATE POLICY "Org isolation select announcements" ON public.announcements FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write announcements" ON public.announcements;
CREATE POLICY "Org isolation write announcements" ON public.announcements FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Attendance table RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read" ON public.attendance;
DROP POLICY IF EXISTS "Allow write self" ON public.attendance;
DROP POLICY IF EXISTS "Org isolation select attendance" ON public.attendance;
CREATE POLICY "Org isolation select attendance" ON public.attendance FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write attendance" ON public.attendance;
CREATE POLICY "Org isolation write attendance" ON public.attendance FOR ALL TO authenticated USING (org_id = public.get_user_org_id() AND auth.uid() = user_id);

-- Leaves table RLS
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read" ON public.leaves;
DROP POLICY IF EXISTS "Allow write" ON public.leaves;
DROP POLICY IF EXISTS "Org isolation select leaves" ON public.leaves;
CREATE POLICY "Org isolation select leaves" ON public.leaves FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write leaves" ON public.leaves;
CREATE POLICY "Org isolation write leaves" ON public.leaves FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Documents table RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read" ON public.documents;
DROP POLICY IF EXISTS "Allow write" ON public.documents;
DROP POLICY IF EXISTS "Org isolation select documents" ON public.documents;
CREATE POLICY "Org isolation select documents" ON public.documents FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write documents" ON public.documents;
CREATE POLICY "Org isolation write documents" ON public.documents FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Performance Goals table RLS
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read" ON public.performance_goals;
DROP POLICY IF EXISTS "Allow write" ON public.performance_goals;
DROP POLICY IF EXISTS "Org isolation select performance_goals" ON public.performance_goals;
CREATE POLICY "Org isolation select performance_goals" ON public.performance_goals FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write performance_goals" ON public.performance_goals;
CREATE POLICY "Org isolation write performance_goals" ON public.performance_goals FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Notifications table RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read self" ON public.notifications;
DROP POLICY IF EXISTS "Allow write" ON public.notifications;
DROP POLICY IF EXISTS "Org isolation select notifications" ON public.notifications;
CREATE POLICY "Org isolation select notifications" ON public.notifications FOR SELECT TO authenticated USING (org_id = public.get_user_org_id() AND auth.uid() = user_id);
DROP POLICY IF EXISTS "Org isolation write notifications" ON public.notifications;
CREATE POLICY "Org isolation write notifications" ON public.notifications FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- Roles table RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all read" ON public.roles;
DROP POLICY IF EXISTS "Admin write" ON public.roles;
DROP POLICY IF EXISTS "Org isolation select roles" ON public.roles;
CREATE POLICY "Org isolation select roles" ON public.roles FOR SELECT TO authenticated USING (org_id = public.get_user_org_id());
DROP POLICY IF EXISTS "Org isolation write roles" ON public.roles;
CREATE POLICY "Org isolation write roles" ON public.roles FOR ALL TO authenticated USING (org_id = public.get_user_org_id());

-- 6. Update the auth user registration trigger to handle company creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_org_id TEXT;
  v_org_name TEXT;
  v_default_role TEXT;
BEGIN
  v_org_name := new.raw_user_meta_data->>'org_name';
  v_org_id := new.raw_user_meta_data->>'org_id';
  
  -- Check if they entered a company name (indicating they want to create a new organization)
  IF v_org_name IS NOT NULL THEN
    -- Generate a unique 8-character ID: e.g. ORG-123456
    v_org_id := 'ORG-' || floor(random() * 900000 + 100000)::text;
    
    INSERT INTO public.organizations (id, name)
    VALUES (v_org_id, v_org_name);
    
    -- Owner gets Organization Admin role ('r1')
    v_default_role := 'r1';
  ELSE
    -- If joining an existing company, verify the Organization ID exists
    IF v_org_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM public.organizations WHERE id = v_org_id) THEN
        RAISE EXCEPTION 'Invalid Organization ID. Please request the correct ID from your administrator.';
      END IF;
    ELSE
      -- Fallback to DEMO organization if neither was provided
      v_org_id := 'ORG-DEMO';
    END IF;
    
    -- Standard employee gets Employee role ('r7')
    v_default_role := 'r7';
  END IF;

  INSERT INTO public.employees (
    id, first_name, last_name, email, employee_id, role_id, 
    position, status, joining_date, avatar_url, org_id
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'Employee'),
    new.email,
    'ACM-' || floor(random() * 9000 + 1000)::text,
    v_default_role,
    'New Employee',
    'active',
    to_char(now(), 'YYYY-MM-DD'),
    'blue',
    v_org_id
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
