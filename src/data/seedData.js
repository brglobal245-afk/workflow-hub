// ============================================================
// WORKFLOW HUB — Complete Demo Seed Data
// "Acme Technologies" — Sample Enterprise Company
// ============================================================

export const PERMISSIONS = {
  // User Management
  CREATE_USER:       'create_user',
  EDIT_USER:         'edit_user',
  SUSPEND_USER:      'suspend_user',
  DELETE_USER:       'delete_user',
  VIEW_ALL_USERS:    'view_all_users',

  // Role Management
  CREATE_ROLE:       'create_role',
  ASSIGN_ROLE:       'assign_role',
  EDIT_ROLE:         'edit_role',
  DELETE_ROLE:       'delete_role',

  // Department Management
  CREATE_DEPARTMENT: 'create_department',
  EDIT_DEPARTMENT:   'edit_department',
  DELETE_DEPARTMENT: 'delete_department',
  VIEW_DEPARTMENT:   'view_department',

  // Team Management
  CREATE_TEAM:       'create_team',
  EDIT_TEAM:         'edit_team',
  DELETE_TEAM:       'delete_team',
  MANAGE_TEAM_MEMBERS: 'manage_team_members',

  // Task Management
  CREATE_TASK:       'create_task',
  ASSIGN_TASK:       'assign_task',
  REVIEW_TASK:       'review_task',
  DELETE_TASK:       'delete_task',
  VIEW_ALL_TASKS:    'view_all_tasks',

  // Communication
  SEND_MESSAGES:     'send_messages',
  CREATE_GROUPS:     'create_groups',
  BROADCAST:         'broadcast_announcements',
  MESSAGE_LEADERSHIP:'message_leadership',

  // Reports
  VIEW_REPORTS:      'view_reports',
  EXPORT_REPORTS:    'export_reports',
  VIEW_ALL_REPORTS:  'view_all_reports',

  // Administration
  MANAGE_ORG:        'manage_org_settings',
  MANAGE_SECURITY:   'manage_security_settings',
  MANAGE_LEAVE_TYPES:'manage_leave_types',
  APPROVE_LEAVE:     'approve_leave',

  // Attendance
  VIEW_ALL_ATTENDANCE: 'view_all_attendance',

  // Documents
  MANAGE_DOCUMENTS:  'manage_documents',
  VIEW_ALL_DOCUMENTS:'view_all_documents',

  // Performance
  REVIEW_PERFORMANCE:'review_performance',
  VIEW_ALL_PERFORMANCE:'view_all_performance',
};

export const ROLES = [
  {
    id: 'r1',
    name: 'Organization Admin',
    authorityLevel: 100,
    isSystem: true,
    color: '#4f46e5',
    permissions: Object.values(PERMISSIONS),
    description: 'Full administrative access to the organization',
  },
  {
    id: 'r2',
    name: 'Department Head',
    authorityLevel: 80,
    isSystem: true,
    color: '#0891b2',
    permissions: [
      PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.EDIT_USER,
      PERMISSIONS.CREATE_TEAM, PERMISSIONS.EDIT_TEAM, PERMISSIONS.MANAGE_TEAM_MEMBERS,
      PERMISSIONS.VIEW_DEPARTMENT, PERMISSIONS.EDIT_DEPARTMENT,
      PERMISSIONS.CREATE_TASK, PERMISSIONS.ASSIGN_TASK, PERMISSIONS.REVIEW_TASK, PERMISSIONS.VIEW_ALL_TASKS,
      PERMISSIONS.SEND_MESSAGES, PERMISSIONS.CREATE_GROUPS, PERMISSIONS.BROADCAST,
      PERMISSIONS.VIEW_REPORTS, PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.APPROVE_LEAVE, PERMISSIONS.VIEW_ALL_ATTENDANCE,
      PERMISSIONS.VIEW_ALL_DOCUMENTS, PERMISSIONS.REVIEW_PERFORMANCE, PERMISSIONS.VIEW_ALL_PERFORMANCE,
    ],
    description: 'Leads an entire department',
  },
  {
    id: 'r3',
    name: 'Manager',
    authorityLevel: 70,
    isSystem: true,
    color: '#059669',
    permissions: [
      PERMISSIONS.VIEW_ALL_USERS,
      PERMISSIONS.MANAGE_TEAM_MEMBERS,
      PERMISSIONS.VIEW_DEPARTMENT,
      PERMISSIONS.CREATE_TASK, PERMISSIONS.ASSIGN_TASK, PERMISSIONS.REVIEW_TASK, PERMISSIONS.VIEW_ALL_TASKS,
      PERMISSIONS.SEND_MESSAGES, PERMISSIONS.CREATE_GROUPS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.APPROVE_LEAVE, PERMISSIONS.VIEW_ALL_ATTENDANCE,
      PERMISSIONS.REVIEW_PERFORMANCE,
    ],
    description: 'Manages a team or project',
  },
  {
    id: 'r4',
    name: 'Team Lead',
    authorityLevel: 60,
    isSystem: true,
    color: '#7c3aed',
    permissions: [
      PERMISSIONS.VIEW_ALL_USERS,
      PERMISSIONS.VIEW_DEPARTMENT,
      PERMISSIONS.CREATE_TASK, PERMISSIONS.ASSIGN_TASK, PERMISSIONS.REVIEW_TASK,
      PERMISSIONS.SEND_MESSAGES, PERMISSIONS.CREATE_GROUPS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.APPROVE_LEAVE,
    ],
    description: 'Leads a sub-team',
  },
  {
    id: 'r5',
    name: 'HR Manager',
    authorityLevel: 75,
    isSystem: false,
    color: '#db2777',
    permissions: [
      PERMISSIONS.CREATE_USER, PERMISSIONS.EDIT_USER, PERMISSIONS.SUSPEND_USER,
      PERMISSIONS.ASSIGN_ROLE,
      PERMISSIONS.VIEW_ALL_USERS, PERMISSIONS.VIEW_DEPARTMENT,
      PERMISSIONS.CREATE_TASK, PERMISSIONS.ASSIGN_TASK,
      PERMISSIONS.SEND_MESSAGES, PERMISSIONS.BROADCAST,
      PERMISSIONS.VIEW_REPORTS, PERMISSIONS.EXPORT_REPORTS, PERMISSIONS.VIEW_ALL_REPORTS,
      PERMISSIONS.APPROVE_LEAVE, PERMISSIONS.MANAGE_LEAVE_TYPES, PERMISSIONS.VIEW_ALL_ATTENDANCE,
      PERMISSIONS.MANAGE_DOCUMENTS, PERMISSIONS.VIEW_ALL_DOCUMENTS,
      PERMISSIONS.REVIEW_PERFORMANCE, PERMISSIONS.VIEW_ALL_PERFORMANCE,
    ],
    description: 'Manages human resources and personnel',
  },
  {
    id: 'r6',
    name: 'Senior Employee',
    authorityLevel: 40,
    isSystem: false,
    color: '#0284c7',
    permissions: [
      PERMISSIONS.VIEW_ALL_USERS,
      PERMISSIONS.VIEW_DEPARTMENT,
      PERMISSIONS.CREATE_TASK,
      PERMISSIONS.SEND_MESSAGES,
      PERMISSIONS.MESSAGE_LEADERSHIP,
      PERMISSIONS.VIEW_REPORTS,
    ],
    description: 'Experienced team member with elevated access',
  },
  {
    id: 'r7',
    name: 'Employee',
    authorityLevel: 20,
    isSystem: true,
    color: '#64748b',
    permissions: [
      PERMISSIONS.VIEW_DEPARTMENT,
      PERMISSIONS.SEND_MESSAGES,
      PERMISSIONS.MESSAGE_LEADERSHIP,
    ],
    description: 'Standard employee',
  },
  {
    id: 'r8',
    name: 'Intern',
    authorityLevel: 5,
    isSystem: false,
    color: '#f59e0b',
    permissions: [
      PERMISSIONS.SEND_MESSAGES,
    ],
    description: 'Temporary intern with minimal access',
  },
];

export const DEPARTMENTS = [
  { id: 'd1', name: 'Engineering', emoji: '⚙️', color: '#4f46e5', headId: 'e2', memberCount: 12, teamCount: 3, description: 'Product development, infrastructure, and technical operations', status: 'active', budget: '$2.4M' },
  { id: 'd2', name: 'Human Resources', emoji: '👥', color: '#db2777', headId: 'e6', memberCount: 5, teamCount: 1, description: 'Talent acquisition, employee relations, and HR policies', status: 'active', budget: '$450K' },
  { id: 'd3', name: 'Marketing', emoji: '📢', color: '#7c3aed', headId: 'e10', memberCount: 8, teamCount: 2, description: 'Brand management, digital marketing, and campaigns', status: 'active', budget: '$800K' },
  { id: 'd4', name: 'Sales', emoji: '💼', color: '#059669', headId: 'e14', memberCount: 10, teamCount: 2, description: 'Revenue generation, client acquisition, and account management', status: 'active', budget: '$1.1M' },
  { id: 'd5', name: 'Operations', emoji: '🏢', color: '#0891b2', headId: 'e18', memberCount: 6, teamCount: 1, description: 'Business operations, process management, and logistics', status: 'active', budget: '$600K' },
  { id: 'd6', name: 'Finance', emoji: '💰', color: '#d97706', headId: 'e22', memberCount: 4, teamCount: 1, description: 'Financial planning, accounting, and reporting', status: 'active', budget: '$300K' },
];

export const TEAMS = [
  { id: 't1', name: 'Frontend Team', departmentId: 'd1', leaderId: 'e3', memberIds: ['e3','e4','e5'], description: 'Building user interfaces and frontend systems' },
  { id: 't2', name: 'Backend Team', departmentId: 'd1', leaderId: 'e7', memberIds: ['e7','e8','e9'], description: 'APIs, databases, and server-side development' },
  { id: 't3', name: 'DevOps Team', departmentId: 'd1', leaderId: 'e2', memberIds: ['e2','e23','e24'], description: 'Infrastructure, CI/CD, and cloud operations' },
  { id: 't4', name: 'HR Team', departmentId: 'd2', leaderId: 'e6', memberIds: ['e6','e25','e26'], description: 'Recruitment and employee management' },
  { id: 't5', name: 'Content & Brand', departmentId: 'd3', leaderId: 'e10', memberIds: ['e10','e11','e12'], description: 'Content creation and brand strategy' },
  { id: 't6', name: 'Enterprise Sales', departmentId: 'd4', leaderId: 'e14', memberIds: ['e14','e15','e16'], description: 'B2B sales and enterprise accounts' },
];

// Avatar color assignments
const AVATAR_COLORS = ['blue','green','purple','orange','pink','teal','red','yellow'];
const getAvatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];

export const EMPLOYEES = [
  // Admin
  {
    id: 'e1', employeeId: 'ACM-001',
    firstName: 'Alexandra', lastName: 'Chen',
    email: 'alexandra.chen@acmetech.com', phone: '+1 (555) 001-0001',
    departmentId: null, teamId: null, managerId: null, roleId: 'r1',
    joiningDate: '2019-01-15', employmentType: 'full_time', status: 'active',
    position: 'Organization Administrator', avatarColor: getAvatarColor(0),
    bio: 'Co-founder and chief administrator of Acme Technologies.',
    location: 'San Francisco, CA',
  },
  // Engineering Head
  {
    id: 'e2', employeeId: 'ACM-002',
    firstName: 'Marcus', lastName: 'Rodriguez',
    email: 'marcus.r@acmetech.com', phone: '+1 (555) 001-0002',
    departmentId: 'd1', teamId: 't3', managerId: 'e1', roleId: 'r2',
    joiningDate: '2019-03-01', employmentType: 'full_time', status: 'active',
    position: 'VP of Engineering', avatarColor: getAvatarColor(1),
    bio: 'Engineering leader with 15+ years of experience building scalable systems.',
    location: 'San Francisco, CA',
  },
  // Frontend Lead
  {
    id: 'e3', employeeId: 'ACM-003',
    firstName: 'Sarah', lastName: 'Kim',
    email: 'sarah.kim@acmetech.com', phone: '+1 (555) 001-0003',
    departmentId: 'd1', teamId: 't1', managerId: 'e2', roleId: 'r4',
    joiningDate: '2020-06-15', employmentType: 'full_time', status: 'active',
    position: 'Frontend Team Lead', avatarColor: getAvatarColor(2),
    bio: 'React specialist passionate about UI/UX and performance.',
    location: 'Austin, TX',
  },
  // Frontend Senior
  {
    id: 'e4', employeeId: 'ACM-004',
    firstName: 'James', lastName: 'Patel',
    email: 'james.patel@acmetech.com', phone: '+1 (555) 001-0004',
    departmentId: 'd1', teamId: 't1', managerId: 'e3', roleId: 'r6',
    joiningDate: '2021-02-01', employmentType: 'full_time', status: 'active',
    position: 'Senior Frontend Engineer', avatarColor: getAvatarColor(3),
    bio: 'Full-stack developer with a focus on React and TypeScript.',
    location: 'New York, NY',
  },
  // Frontend Employee
  {
    id: 'e5', employeeId: 'ACM-005',
    firstName: 'Olivia', lastName: 'Thompson',
    email: 'olivia.t@acmetech.com', phone: '+1 (555) 001-0005',
    departmentId: 'd1', teamId: 't1', managerId: 'e3', roleId: 'r7',
    joiningDate: '2022-09-12', employmentType: 'full_time', status: 'active',
    position: 'Frontend Engineer', avatarColor: getAvatarColor(4),
    bio: 'UI developer specializing in animations and accessibility.',
    location: 'Chicago, IL',
  },
  // HR Head
  {
    id: 'e6', employeeId: 'ACM-006',
    firstName: 'Priya', lastName: 'Sharma',
    email: 'priya.sharma@acmetech.com', phone: '+1 (555) 001-0006',
    departmentId: 'd2', teamId: 't4', managerId: 'e1', roleId: 'r5',
    joiningDate: '2019-08-20', employmentType: 'full_time', status: 'active',
    position: 'HR Manager', avatarColor: getAvatarColor(5),
    bio: 'People-first HR leader with a passion for organizational culture.',
    location: 'San Francisco, CA',
  },
  // Backend Lead
  {
    id: 'e7', employeeId: 'ACM-007',
    firstName: 'Daniel', lastName: 'Okonkwo',
    email: 'daniel.o@acmetech.com', phone: '+1 (555) 001-0007',
    departmentId: 'd1', teamId: 't2', managerId: 'e2', roleId: 'r4',
    joiningDate: '2020-01-10', employmentType: 'full_time', status: 'active',
    position: 'Backend Team Lead', avatarColor: getAvatarColor(6),
    bio: 'Distributed systems architect and Node.js expert.',
    location: 'Atlanta, GA',
  },
  // Backend Senior
  {
    id: 'e8', employeeId: 'ACM-008',
    firstName: 'Emma', lastName: 'Larsson',
    email: 'emma.l@acmetech.com', phone: '+1 (555) 001-0008',
    departmentId: 'd1', teamId: 't2', managerId: 'e7', roleId: 'r6',
    joiningDate: '2021-04-19', employmentType: 'full_time', status: 'active',
    position: 'Senior Backend Engineer', avatarColor: getAvatarColor(7),
    bio: 'Database optimization and API design specialist.',
    location: 'Seattle, WA',
  },
  // Backend Employee
  {
    id: 'e9', employeeId: 'ACM-009',
    firstName: 'Raj', lastName: 'Nakamura',
    email: 'raj.n@acmetech.com', phone: '+1 (555) 001-0009',
    departmentId: 'd1', teamId: 't2', managerId: 'e7', roleId: 'r7',
    joiningDate: '2023-01-09', employmentType: 'full_time', status: 'on_leave',
    position: 'Backend Engineer', avatarColor: getAvatarColor(0),
    bio: 'Microservices and container orchestration enthusiast.',
    location: 'Portland, OR',
  },
  // Marketing Head
  {
    id: 'e10', employeeId: 'ACM-010',
    firstName: 'Sofia', lastName: 'Morales',
    email: 'sofia.m@acmetech.com', phone: '+1 (555) 001-0010',
    departmentId: 'd3', teamId: 't5', managerId: 'e1', roleId: 'r2',
    joiningDate: '2020-03-01', employmentType: 'full_time', status: 'active',
    position: 'Head of Marketing', avatarColor: getAvatarColor(1),
    bio: 'Brand strategist and digital marketing expert.',
    location: 'Los Angeles, CA',
  },
  {
    id: 'e11', employeeId: 'ACM-011',
    firstName: 'Lucas', lastName: 'Bennett',
    email: 'lucas.b@acmetech.com', phone: '+1 (555) 001-0011',
    departmentId: 'd3', teamId: 't5', managerId: 'e10', roleId: 'r6',
    joiningDate: '2021-07-05', employmentType: 'full_time', status: 'active',
    position: 'Senior Content Strategist', avatarColor: getAvatarColor(2),
    bio: 'Content strategist and SEO specialist.',
    location: 'Denver, CO',
  },
  {
    id: 'e12', employeeId: 'ACM-012',
    firstName: 'Aisha', lastName: 'Abdullah',
    email: 'aisha.a@acmetech.com', phone: '+1 (555) 001-0012',
    departmentId: 'd3', teamId: 't5', managerId: 'e10', roleId: 'r7',
    joiningDate: '2022-11-14', employmentType: 'full_time', status: 'active',
    position: 'Marketing Specialist', avatarColor: getAvatarColor(3),
    bio: 'Social media and campaign management expert.',
    location: 'Miami, FL',
  },
  // Sales Intern
  {
    id: 'e13', employeeId: 'ACM-013',
    firstName: 'Tyler', lastName: 'Brooks',
    email: 'tyler.b@acmetech.com', phone: '+1 (555) 001-0013',
    departmentId: 'd3', teamId: 't5', managerId: 'e10', roleId: 'r8',
    joiningDate: '2024-01-15', employmentType: 'intern', status: 'active',
    position: 'Marketing Intern', avatarColor: getAvatarColor(4),
    bio: 'Marketing intern learning the ropes.',
    location: 'San Francisco, CA',
  },
  // Sales Head
  {
    id: 'e14', employeeId: 'ACM-014',
    firstName: 'Nathan', lastName: 'Obi',
    email: 'nathan.o@acmetech.com', phone: '+1 (555) 001-0014',
    departmentId: 'd4', teamId: 't6', managerId: 'e1', roleId: 'r2',
    joiningDate: '2019-11-01', employmentType: 'full_time', status: 'active',
    position: 'Head of Sales', avatarColor: getAvatarColor(5),
    bio: 'Revenue-focused sales leader with enterprise B2B expertise.',
    location: 'Chicago, IL',
  },
  {
    id: 'e15', employeeId: 'ACM-015',
    firstName: 'Rachel', lastName: 'Wong',
    email: 'rachel.w@acmetech.com', phone: '+1 (555) 001-0015',
    departmentId: 'd4', teamId: 't6', managerId: 'e14', roleId: 'r3',
    joiningDate: '2020-08-10', employmentType: 'full_time', status: 'active',
    position: 'Sales Manager', avatarColor: getAvatarColor(6),
    bio: 'Account management and client relationship specialist.',
    location: 'Dallas, TX',
  },
  {
    id: 'e16', employeeId: 'ACM-016',
    firstName: 'Chris', lastName: 'Petrov',
    email: 'chris.p@acmetech.com', phone: '+1 (555) 001-0016',
    departmentId: 'd4', teamId: 't6', managerId: 'e15', roleId: 'r7',
    joiningDate: '2022-03-22', employmentType: 'full_time', status: 'active',
    position: 'Sales Executive', avatarColor: getAvatarColor(7),
    bio: 'Cold outreach and pipeline management specialist.',
    location: 'Houston, TX',
  },
  {
    id: 'e17', employeeId: 'ACM-017',
    firstName: 'Maya', lastName: 'Johnson',
    email: 'maya.j@acmetech.com', phone: '+1 (555) 001-0017',
    departmentId: 'd4', teamId: 't6', managerId: 'e15', roleId: 'r7',
    joiningDate: '2023-06-01', employmentType: 'contract', status: 'active',
    position: 'Sales Representative', avatarColor: getAvatarColor(0),
    bio: 'Contract sales representative focused on SMB segment.',
    location: 'Phoenix, AZ',
  },
  // Operations Head
  {
    id: 'e18', employeeId: 'ACM-018',
    firstName: 'Kevin', lastName: 'Fitzgerald',
    email: 'kevin.f@acmetech.com', phone: '+1 (555) 001-0018',
    departmentId: 'd5', teamId: null, managerId: 'e1', roleId: 'r2',
    joiningDate: '2020-05-18', employmentType: 'full_time', status: 'active',
    position: 'Head of Operations', avatarColor: getAvatarColor(1),
    bio: 'Operations specialist focused on process optimization.',
    location: 'San Francisco, CA',
  },
  {
    id: 'e19', employeeId: 'ACM-019',
    firstName: 'Zoe', lastName: 'Nguyen',
    email: 'zoe.n@acmetech.com', phone: '+1 (555) 001-0019',
    departmentId: 'd5', teamId: null, managerId: 'e18', roleId: 'r7',
    joiningDate: '2022-01-03', employmentType: 'full_time', status: 'active',
    position: 'Operations Analyst', avatarColor: getAvatarColor(2),
    bio: 'Data-driven operations professional.',
    location: 'Boston, MA',
  },
  {
    id: 'e20', employeeId: 'ACM-020',
    firstName: 'Ben', lastName: 'Kowalski',
    email: 'ben.k@acmetech.com', phone: '+1 (555) 001-0020',
    departmentId: 'd5', teamId: null, managerId: 'e18', roleId: 'r7',
    joiningDate: '2022-07-11', employmentType: 'part_time', status: 'active',
    position: 'Office Coordinator', avatarColor: getAvatarColor(3),
    bio: 'Part-time office and logistics coordinator.',
    location: 'San Francisco, CA',
  },
  // Finance Head
  {
    id: 'e22', employeeId: 'ACM-022',
    firstName: 'Diana', lastName: 'Sterling',
    email: 'diana.s@acmetech.com', phone: '+1 (555) 001-0022',
    departmentId: 'd6', teamId: null, managerId: 'e1', roleId: 'r2',
    joiningDate: '2019-09-02', employmentType: 'full_time', status: 'active',
    position: 'CFO', avatarColor: getAvatarColor(4),
    bio: 'Financial strategist with deep experience in SaaS finance.',
    location: 'San Francisco, CA',
  },
  {
    id: 'e23', employeeId: 'ACM-023',
    firstName: 'Hassan', lastName: 'Mirza',
    email: 'hassan.m@acmetech.com', phone: '+1 (555) 001-0023',
    departmentId: 'd1', teamId: 't3', managerId: 'e2', roleId: 'r6',
    joiningDate: '2021-10-04', employmentType: 'full_time', status: 'active',
    position: 'Senior DevOps Engineer', avatarColor: getAvatarColor(5),
    bio: 'Cloud infrastructure and Kubernetes specialist.',
    location: 'Remote',
  },
  {
    id: 'e24', employeeId: 'ACM-024',
    firstName: 'Lily', lastName: 'Chang',
    email: 'lily.c@acmetech.com', phone: '+1 (555) 001-0024',
    departmentId: 'd1', teamId: 't3', managerId: 'e2', roleId: 'r8',
    joiningDate: '2024-02-19', employmentType: 'intern', status: 'active',
    position: 'DevOps Intern', avatarColor: getAvatarColor(6),
    bio: 'Intern learning cloud and DevOps practices.',
    location: 'Remote',
  },
  {
    id: 'e25', employeeId: 'ACM-025',
    firstName: 'Grace', lastName: 'Adeyemi',
    email: 'grace.a@acmetech.com', phone: '+1 (555) 001-0025',
    departmentId: 'd2', teamId: 't4', managerId: 'e6', roleId: 'r7',
    joiningDate: '2021-12-06', employmentType: 'full_time', status: 'active',
    position: 'HR Specialist', avatarColor: getAvatarColor(7),
    bio: 'Recruiting and onboarding specialist.',
    location: 'New York, NY',
  },
  {
    id: 'e26', employeeId: 'ACM-026',
    firstName: 'Tom', lastName: 'Hayashi',
    email: 'tom.h@acmetech.com', phone: '+1 (555) 001-0026',
    departmentId: 'd2', teamId: 't4', managerId: 'e6', roleId: 'r7',
    joiningDate: '2022-05-16', employmentType: 'full_time', status: 'active',
    position: 'HR Coordinator', avatarColor: getAvatarColor(0),
    bio: 'HR generalist supporting multiple departments.',
    location: 'San Francisco, CA',
  },
];

export const TASKS = [
  {
    id: 'task1', title: 'Redesign Dashboard UI Components',
    description: 'Revamp the main dashboard with new design system. Focus on better data visualization, improved card layouts, and enhanced responsiveness.',
    priority: 'high', status: 'in_progress', progress: 60,
    deadline: '2026-07-01', creatorId: 'e3', assigneeId: 'e4',
    teamId: 't1', departmentId: 'd1',
    createdAt: '2026-06-01', tags: ['frontend', 'design', 'ui'],
    attachments: 2, comments: 5,
  },
  {
    id: 'task2', title: 'Implement API Rate Limiting',
    description: 'Add rate limiting to all public API endpoints. Implement sliding window algorithm with Redis-based counters. Include proper error responses and documentation.',
    priority: 'critical', status: 'in_progress', progress: 40,
    deadline: '2026-06-25', creatorId: 'e7', assigneeId: 'e8',
    teamId: 't2', departmentId: 'd1',
    createdAt: '2026-06-03', tags: ['backend', 'security', 'api'],
    attachments: 0, comments: 8,
  },
  {
    id: 'task3', title: 'Set Up CI/CD Pipeline for Staging',
    description: 'Configure automated CI/CD pipeline for the staging environment using GitHub Actions and Docker. Include automated testing gates.',
    priority: 'high', status: 'under_review', progress: 90,
    deadline: '2026-06-20', creatorId: 'e2', assigneeId: 'e23',
    teamId: 't3', departmentId: 'd1',
    createdAt: '2026-06-05', tags: ['devops', 'ci-cd', 'infrastructure'],
    attachments: 1, comments: 3,
  },
  {
    id: 'task4', title: 'Q3 Marketing Campaign Strategy',
    description: 'Develop comprehensive Q3 marketing campaign. Include social media, email marketing, and content strategy. Budget allocation required.',
    priority: 'high', status: 'not_started', progress: 0,
    deadline: '2026-07-10', creatorId: 'e10', assigneeId: 'e11',
    teamId: 't5', departmentId: 'd3',
    createdAt: '2026-06-10', tags: ['marketing', 'strategy', 'q3'],
    attachments: 0, comments: 2,
  },
  {
    id: 'task5', title: 'Onboard New Enterprise Client — TechCorp',
    description: 'Complete onboarding process for TechCorp. Schedule kickoff, deliver training, and set up their account.',
    priority: 'critical', status: 'in_progress', progress: 30,
    deadline: '2026-06-22', creatorId: 'e14', assigneeId: 'e15',
    teamId: 't6', departmentId: 'd4',
    createdAt: '2026-06-08', tags: ['sales', 'client', 'onboarding'],
    attachments: 3, comments: 12,
  },
  {
    id: 'task6', title: 'Employee Handbook Update 2026',
    description: 'Update the employee handbook to reflect new company policies, remote work guidelines, and benefits package for 2026.',
    priority: 'medium', status: 'completed', progress: 100,
    deadline: '2026-06-15', creatorId: 'e6', assigneeId: 'e25',
    teamId: 't4', departmentId: 'd2',
    createdAt: '2026-05-20', tags: ['hr', 'policy', 'documentation'],
    attachments: 1, comments: 6,
  },
  {
    id: 'task7', title: 'Database Performance Optimization',
    description: 'Identify slow queries and optimize database indexes. Target: reduce p95 latency from 800ms to under 200ms.',
    priority: 'high', status: 'in_progress', progress: 50,
    deadline: '2026-06-28', creatorId: 'e7', assigneeId: 'e9',
    teamId: 't2', departmentId: 'd1',
    createdAt: '2026-06-07', tags: ['backend', 'database', 'performance'],
    attachments: 0, comments: 4,
  },
  {
    id: 'task8', title: 'Blog Post: Engineering Culture at Acme',
    description: 'Write a 1500-word blog post about engineering culture, practices, and team dynamics at Acme Technologies.',
    priority: 'low', status: 'completed', progress: 100,
    deadline: '2026-06-10', creatorId: 'e10', assigneeId: 'e12',
    teamId: 't5', departmentId: 'd3',
    createdAt: '2026-06-01', tags: ['content', 'blog', 'employer-brand'],
    attachments: 1, comments: 3,
  },
  {
    id: 'task9', title: 'Implement Dark Mode for App',
    description: 'Add full dark mode support to the web application. Implement theme toggle with system preference detection.',
    priority: 'medium', status: 'not_started', progress: 0,
    deadline: '2026-07-15', creatorId: 'e3', assigneeId: 'e5',
    teamId: 't1', departmentId: 'd1',
    createdAt: '2026-06-12', tags: ['frontend', 'ui', 'ux'],
    attachments: 0, comments: 1,
  },
  {
    id: 'task10', title: 'Q2 Financial Reporting',
    description: 'Prepare Q2 financial statements, variance analysis, and board presentation. Due before Q2 close.',
    priority: 'critical', status: 'under_review', progress: 85,
    deadline: '2026-06-30', creatorId: 'e22', assigneeId: 'e22',
    teamId: null, departmentId: 'd6',
    createdAt: '2026-06-01', tags: ['finance', 'reporting', 'q2'],
    attachments: 4, comments: 7,
  },
  {
    id: 'task11', title: 'Kubernetes Cluster Upgrade',
    description: 'Upgrade production Kubernetes cluster from v1.28 to v1.30. Includes node pool migration and add-on updates.',
    priority: 'high', status: 'not_started', progress: 0,
    deadline: '2026-07-05', creatorId: 'e2', assigneeId: 'e23',
    teamId: 't3', departmentId: 'd1',
    createdAt: '2026-06-14', tags: ['devops', 'kubernetes', 'infrastructure'],
    attachments: 0, comments: 2,
  },
  {
    id: 'task12', title: 'Sales Pipeline Review & Cleanup',
    description: 'Review and clean up the CRM sales pipeline. Remove stale leads, update deal stages, and generate accurate forecast.',
    priority: 'medium', status: 'rejected', progress: 0,
    deadline: '2026-06-18', creatorId: 'e14', assigneeId: 'e16',
    teamId: 't6', departmentId: 'd4',
    createdAt: '2026-06-09', tags: ['sales', 'crm'],
    attachments: 0, comments: 1,
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 'ann1', type: 'general',
    title: '🎉 Welcome to WorkFlow Hub — Our New Platform!',
    content: "We are thrilled to announce that Acme Technologies has officially launched WorkFlow Hub — our all-in-one workforce management platform. Starting today, all tasks, communications, attendance tracking, and document management will happen here. Please take some time to explore the platform and update your profile. Reach out to HR if you have any questions!",
    authorId: 'e1', publishedAt: '2026-06-19T08:00:00Z', isPublished: true,
    readCount: 21, totalCount: 26, isPinned: true,
    attachments: [],
  },
  {
    id: 'ann2', type: 'hr',
    title: '📋 Updated Remote Work Policy — Effective July 1st',
    content: "Following our all-hands review, the updated Remote Work Policy will take effect on July 1st, 2026. Key changes include: (1) Hybrid model — minimum 2 days in-office per week, (2) Home office equipment stipend increased to $750/year, (3) New timezone overlap requirements for distributed teams. Full policy document attached below. Questions? Contact HR.",
    authorId: 'e6', publishedAt: '2026-06-18T10:00:00Z', isPublished: true,
    readCount: 18, totalCount: 26, isPinned: false,
    attachments: ['Remote_Work_Policy_2026.pdf'],
  },
  {
    id: 'ann3', type: 'event',
    title: '🏖️ Company Team Building Day — June 28th',
    content: "Mark your calendars! Our quarterly team building day will be held on June 28th at Golden Gate Park. Activities include team sports, a BBQ lunch, and our annual Hack-a-thon challenge. RSVP by June 22nd via the HR portal. Attendance is optional but strongly encouraged — this is a great opportunity to connect with colleagues!",
    authorId: 'e6', publishedAt: '2026-06-17T14:00:00Z', isPublished: true,
    readCount: 23, totalCount: 26, isPinned: false,
    attachments: [],
  },
  {
    id: 'ann4', type: 'policy',
    title: '🔒 New Security Requirements — MFA Mandatory',
    content: "Effective immediately: Multi-Factor Authentication (MFA) is now mandatory for all employee accounts. You have 7 days to enable MFA before account access is restricted. Please navigate to Settings → Security to set up your authenticator app. Contact IT support if you need assistance.",
    authorId: 'e1', publishedAt: '2026-06-15T09:00:00Z', isPublished: true,
    readCount: 26, totalCount: 26, isPinned: true,
    attachments: [],
  },
  {
    id: 'ann5', type: 'emergency',
    title: '⚠️ Office Closure — Maintenance Window June 21st',
    content: "The San Francisco office will be closed on Saturday, June 21st for scheduled HVAC maintenance. Remote work is permitted that day. Please ensure all physical access cards are returned before leaving Friday. Security will be on-site during the maintenance window.",
    authorId: 'e18', publishedAt: '2026-06-14T16:00:00Z', isPublished: true,
    readCount: 26, totalCount: 26, isPinned: false,
    attachments: [],
  },
];

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };

export const ATTENDANCE = [
  { id: 'att1', userId: 'e4', date: daysAgo(0), checkIn: '09:02', checkOut: null, status: 'present', type: 'office' },
  { id: 'att2', userId: 'e4', date: daysAgo(1), checkIn: '09:15', checkOut: '18:30', status: 'present', type: 'office' },
  { id: 'att3', userId: 'e4', date: daysAgo(2), checkIn: '10:02', checkOut: '18:45', status: 'late', type: 'office' },
  { id: 'att4', userId: 'e4', date: daysAgo(3), checkIn: '09:00', checkOut: '18:00', status: 'present', type: 'wfh' },
  { id: 'att5', userId: 'e4', date: daysAgo(4), checkIn: null, checkOut: null, status: 'absent', type: null },
  { id: 'att6', userId: 'e4', date: daysAgo(7), checkIn: '08:55', checkOut: '18:10', status: 'present', type: 'office' },
  { id: 'att7', userId: 'e4', date: daysAgo(8), checkIn: '09:05', checkOut: '17:50', status: 'present', type: 'wfh' },
  { id: 'att8', userId: 'e4', date: daysAgo(9), checkIn: '09:00', checkOut: '13:00', status: 'half_day', type: 'office' },
  { id: 'att9', userId: 'e4', date: daysAgo(10), checkIn: '09:10', checkOut: '18:20', status: 'present', type: 'office' },
];

export const LEAVE_REQUESTS = [
  {
    id: 'lv1', userId: 'e4', type: 'casual',
    startDate: '2026-07-07', endDate: '2026-07-08',
    reason: 'Family event — attending sibling\'s graduation.',
    status: 'approved', approverId: 'e3',
    appliedAt: '2026-06-10', days: 2,
  },
  {
    id: 'lv2', userId: 'e9', type: 'sick',
    startDate: '2026-06-16', endDate: '2026-06-19',
    reason: 'Medical procedure and recovery.',
    status: 'approved', approverId: 'e7',
    appliedAt: '2026-06-14', days: 4,
  },
  {
    id: 'lv3', userId: 'e5', type: 'earned',
    startDate: '2026-07-15', endDate: '2026-07-22',
    reason: 'Annual vacation to Europe.',
    status: 'pending', approverId: null,
    appliedAt: '2026-06-16', days: 8,
  },
  {
    id: 'lv4', userId: 'e12', type: 'casual',
    startDate: '2026-06-25', endDate: '2026-06-25',
    reason: 'Personal work.',
    status: 'pending', approverId: null,
    appliedAt: '2026-06-17', days: 1,
  },
  {
    id: 'lv5', userId: 'e16', type: 'sick',
    startDate: '2026-06-12', endDate: '2026-06-12',
    reason: 'Not feeling well.',
    status: 'rejected', approverId: 'e15',
    appliedAt: '2026-06-11', days: 1,
  },
];

export const MESSAGES = [
  {
    id: 'msg1', senderId: 'e3', receiverId: 'e4',
    content: 'Hey James! Can you take a look at the dashboard PR when you get a chance?',
    sentAt: '2026-06-19T14:30:00Z', readAt: '2026-06-19T14:35:00Z', type: 'text',
  },
  {
    id: 'msg2', senderId: 'e4', receiverId: 'e3',
    content: 'Sure Sarah! I\'ll review it before EOD. Is there anything specific you want me to focus on?',
    sentAt: '2026-06-19T14:37:00Z', readAt: '2026-06-19T14:40:00Z', type: 'text',
  },
  {
    id: 'msg3', senderId: 'e3', receiverId: 'e4',
    content: 'Yes — please focus on the chart performance. It seems a bit slow when filtering large datasets.',
    sentAt: '2026-06-19T14:42:00Z', readAt: null, type: 'text',
  },
  {
    id: 'msg4', senderId: 'e6', receiverId: 'e4',
    content: 'Hi James, your Q2 performance review is scheduled for tomorrow at 2 PM. Please prepare your self-assessment.',
    sentAt: '2026-06-18T11:00:00Z', readAt: '2026-06-18T11:30:00Z', type: 'text',
  },
  {
    id: 'msg5', senderId: 'e2', receiverId: 'e4',
    content: 'Great work on the new component library! The team is loving the new design system.',
    sentAt: '2026-06-17T16:00:00Z', readAt: '2026-06-17T17:00:00Z', type: 'text',
  },
  {
    id: 'msg6', senderId: 'e7', receiverId: 'e2',
    content: 'Marcus, the API rate limiting is on track. Should be ready for review by Friday.',
    sentAt: '2026-06-19T10:00:00Z', readAt: '2026-06-19T10:15:00Z', type: 'text',
  },
  {
    id: 'msg7', senderId: 'e10', receiverId: 'e1',
    content: 'Alexandra, the Q3 campaign proposal is ready for your review.',
    sentAt: '2026-06-19T09:00:00Z', readAt: null, type: 'text',
  },
];

export const LEADERSHIP_MESSAGES = [
  {
    id: 'lm1', senderId: 'e5', recipientId: 'e1',
    subject: 'Suggestion: Flexible Work Hours for Engineers',
    content: 'I wanted to suggest implementing flexible core hours (10am-3pm) for the engineering team. This would allow team members in different time zones to be more productive without sacrificing collaboration windows.',
    type: 'suggestion', priority: 'medium',
    sentAt: '2026-06-18T10:00:00Z', status: 'read', response: null,
  },
  {
    id: 'lm2', senderId: 'e16', recipientId: 'e14',
    subject: 'Process Improvement: Automated Lead Scoring',
    content: 'We\'re spending a lot of time manually qualifying leads. I believe we should invest in AI-powered lead scoring. I\'ve researched a few tools — happy to present findings.',
    type: 'idea', priority: 'low',
    sentAt: '2026-06-17T15:00:00Z', status: 'responded',
    response: 'Great idea Chris! Let\'s discuss this in the next sales team meeting. Prepare a 10-minute presentation.',
  },
  {
    id: 'lm3', senderId: 'e9', recipientId: 'e2',
    subject: 'Concern: Technical Debt in Auth Module',
    content: 'The authentication module is becoming a bottleneck. We\'ve patched it multiple times and it needs a proper refactor. I estimate 2 sprints to do it right.',
    type: 'complaint', priority: 'high',
    sentAt: '2026-06-16T09:00:00Z', status: 'read', response: null,
  },
];

export const DOCUMENTS = [
  { id: 'doc1', title: 'Employee Handbook 2026', type: 'policy', ownerId: 'e6', accessLevel: 'all', uploadedAt: '2026-06-15', size: '2.4 MB', format: 'pdf' },
  { id: 'doc2', title: 'Remote Work Policy', type: 'policy', ownerId: 'e6', accessLevel: 'all', uploadedAt: '2026-06-18', size: '1.1 MB', format: 'pdf' },
  { id: 'doc3', title: 'Engineering Code of Conduct', type: 'policy', ownerId: 'e2', accessLevel: 'department', uploadedAt: '2026-05-10', size: '850 KB', format: 'pdf' },
  { id: 'doc4', title: 'Q2 2026 Financial Report', type: 'report', ownerId: 'e22', accessLevel: 'admin', uploadedAt: '2026-06-30', size: '3.2 MB', format: 'xlsx' },
  { id: 'doc5', title: 'Offer Letter Template', type: 'contract', ownerId: 'e6', accessLevel: 'hr', uploadedAt: '2026-01-01', size: '120 KB', format: 'docx' },
  { id: 'doc6', title: 'NDA Template 2026', type: 'contract', ownerId: 'e6', accessLevel: 'admin', uploadedAt: '2026-01-01', size: '95 KB', format: 'pdf' },
  { id: 'doc7', title: 'Brand Guidelines v3', type: 'guide', ownerId: 'e10', accessLevel: 'all', uploadedAt: '2026-04-20', size: '15.8 MB', format: 'pdf' },
  { id: 'doc8', title: 'API Documentation v2.5', type: 'technical', ownerId: 'e7', accessLevel: 'department', uploadedAt: '2026-06-01', size: '4.5 MB', format: 'pdf' },
];

export const PERFORMANCE_GOALS = [
  { id: 'pg1', userId: 'e4', title: 'Complete React Performance Optimization Course', kpi: 'Certification', target: 1, current: 1, dueDate: '2026-06-30', status: 'completed', category: 'learning' },
  { id: 'pg2', userId: 'e4', title: 'Reduce Dashboard Load Time by 40%', kpi: 'Load time (ms)', target: 600, current: 850, dueDate: '2026-07-31', status: 'in_progress', category: 'performance' },
  { id: 'pg3', userId: 'e4', title: 'Deliver 5 Feature Releases with 0 Critical Bugs', kpi: 'Releases', target: 5, current: 3, dueDate: '2026-12-31', status: 'in_progress', category: 'quality' },
  { id: 'pg4', userId: 'e4', title: 'Mentor 2 Junior Engineers', kpi: 'Mentees', target: 2, current: 1, dueDate: '2026-12-31', status: 'in_progress', category: 'leadership' },
];

export const NOTIFICATIONS = [
  { id: 'n1', userId: 'e4', type: 'task', title: 'Task Update', message: 'Sarah Kim commented on "Redesign Dashboard UI Components"', read: false, createdAt: '2026-06-19T14:42:00Z', link: '/tasks/task1' },
  { id: 'n2', userId: 'e4', type: 'announcement', title: 'New Announcement', message: 'Company Team Building Day — June 28th', read: false, createdAt: '2026-06-17T14:00:00Z', link: '/announcements' },
  { id: 'n3', userId: 'e4', type: 'leave', title: 'Leave Approved', message: 'Your casual leave request for July 7-8 has been approved', read: true, createdAt: '2026-06-12T10:00:00Z', link: '/leaves' },
  { id: 'n4', userId: 'e4', type: 'message', title: 'New Message', message: 'Marcus Rodriguez: Great work on the new component library!', read: true, createdAt: '2026-06-17T16:00:00Z', link: '/messages' },
  { id: 'n5', userId: 'e4', type: 'task', title: 'New Task Assigned', message: 'You have been assigned: "Implement Dark Mode for App"', read: false, createdAt: '2026-06-12T09:00:00Z', link: '/tasks/task9' },
  { id: 'n6', userId: 'e4', type: 'announcement', title: 'Security Update', message: 'New Security Requirements — MFA is now mandatory', read: true, createdAt: '2026-06-15T09:00:00Z', link: '/announcements' },
];

export const LEAVE_BALANCES = {
  e4: { casual: { total: 12, used: 4, pending: 2 }, sick: { total: 10, used: 0, pending: 0 }, earned: { total: 15, used: 5, pending: 0 } }
};

// Demo login personas
export const DEMO_USERS = [
  { id: 'e1', label: 'Organization Admin', description: 'Full platform access', roleId: 'r1', color: '#4f46e5' },
  { id: 'e2', label: 'Department Head', description: 'Engineering department view', roleId: 'r2', color: '#0891b2' },
  { id: 'e3', label: 'Team Lead / Manager', description: 'Frontend team management', roleId: 'r4', color: '#7c3aed' },
  { id: 'e6', label: 'HR Manager', description: 'HR operations and people', roleId: 'r5', color: '#db2777' },
  { id: 'e4', label: 'Employee', description: 'Standard employee view', roleId: 'r7', color: '#64748b' },
];
