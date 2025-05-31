-- Enable the auth schema and extensions
CREATE SCHEMA IF NOT EXISTS auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table to store additional user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'agent', 'driver', 'helper', 'cleaner', 'customer')),
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email LIKE 'admin%' THEN 'admin'
      WHEN NEW.email LIKE 'agent%' THEN 'agent'
      WHEN NEW.email LIKE 'john%' THEN 'driver'
      WHEN NEW.email LIKE 'helper%' THEN 'helper'
      WHEN NEW.email LIKE 'cleaner%' THEN 'cleaner'
      ELSE 'customer'
    END,
    NEW.created_at,
    NEW.created_at
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create demo users using Supabase auth admin api
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
), (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'agent@example.com',
  crypt('agent123', gen_salt('bf')),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
), (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'john@example.com',
  crypt('john123', gen_salt('bf')),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
), (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'helper1@example.com',
  crypt('helper123', gen_salt('bf')),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
), (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'cleaner1@example.com',
  crypt('cleaner123', gen_salt('bf')),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
), (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'customer@example.com',
  crypt('customer123', gen_salt('bf')),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);
