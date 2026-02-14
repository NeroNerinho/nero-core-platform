
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (Extends Supabase Auth)
CREATE TABLE profiles (
  id USER REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'analyst', 'client_view')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLIENTS
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT, -- CNPJ
  email TEXT,
  phone TEXT,
  address JSONB,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- SUPPLIERS
CREATE TABLE suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('outdoor', 'tv', 'radio', 'digital', 'print')),
  email TEXT,
  phone TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_checkings INTEGER DEFAULT 0,
  approved_checkings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CAMPAIGNS
CREATE TABLE campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  status TEXT CHECK (status IN ('planning', 'production', 'approval', 'running', 'completed')) DEFAULT 'planning',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MEDIA ORDERS (PIs)
CREATE TABLE media_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pi_number TEXT UNIQUE NOT NULL, -- "PI-XXXXXX"
  campaign_id UUID REFERENCES campaigns(id),
  supplier_id UUID REFERENCES suppliers(id),
  media_type TEXT CHECK (media_type IN ('outdoor', 'frontlight', 'busdoor', 'tv', 'radio', 'digital', 'print')),
  format TEXT,
  locations JSONB, -- Array of addresses
  start_date DATE,
  end_date DATE,
  value DECIMAL(12,2),
  status TEXT CHECK (status IN ('pending', 'approved', 'running', 'checking_pending', 'checking_approved', 'checking_rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHECKINGS
CREATE TABLE checkings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  media_order_id UUID REFERENCES media_orders(id),
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_by TEXT, -- Supplier email or System
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'resubmission_required')) DEFAULT 'pending',
  rejection_reason TEXT,
  rejection_pdf_url TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHECKING PHOTOS
CREATE TABLE checking_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  checking_id UUID REFERENCES checkings(id),
  location_address TEXT,
  photo_type TEXT CHECK (photo_type IN ('close_up', 'wide_shot', 'night_shot')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  has_gps BOOLEAN DEFAULT FALSE,
  gps_latitude DECIMAL(10,8),
  gps_longitude DECIMAL(11,8),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KANBAN CARDS
CREATE TABLE kanban_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  title TEXT,
  description TEXT,
  column_name TEXT CHECK (column_name IN ('planning', 'production', 'approval', 'running', 'completed')),
  position INTEGER,
  assigned_to UUID[], -- Array of Profile IDs
  due_date DATE,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('checking_received', 'checking_approved', 'checking_rejected', 'campaign_started', 'deadline_approaching', 'supplier_uploaded')),
  title TEXT,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Example: Enable read for authenticated users)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- STORAGE BUCKETS (Executed in Supabase Dashboard or via API, SQL for reference)
-- insert into storage.buckets (id, name, public) values ('checking-photos', 'checking-photos', true);
-- insert into storage.buckets (id, name, public) values ('reports', 'reports', true);
