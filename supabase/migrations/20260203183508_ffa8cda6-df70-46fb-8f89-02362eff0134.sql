-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'company');

-- Create profiles table (links to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create admin_emails whitelist table
CREATE TABLE public.admin_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create colleges table (managed by admin)
CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    tier TEXT,
    courses TEXT[],
    website TEXT,
    contact_email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hiring_drives table
CREATE TABLE public.hiring_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    job_type TEXT NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT,
    skills TEXT[],
    experience_level TEXT,
    eligibility_branches TEXT[],
    min_cgpa DECIMAL(3,2),
    year_of_passing INTEGER,
    backlog_allowed BOOLEAN DEFAULT false,
    description TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_drives ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = check_user_id AND role = 'admin'
    )
$$;

-- Security definer function to check if email is whitelisted for admin
CREATE OR REPLACE FUNCTION public.is_whitelisted_admin(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_emails
        WHERE email = check_email
    )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User roles RLS policies (admin only)
CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
    ON public.user_roles FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
    ON public.user_roles FOR UPDATE
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
    ON public.user_roles FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Admin emails RLS policies (admin only)
CREATE POLICY "Admins can view admin emails"
    ON public.admin_emails FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert admin emails"
    ON public.admin_emails FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete admin emails"
    ON public.admin_emails FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Companies RLS policies
CREATE POLICY "Users can view own company"
    ON public.companies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all companies"
    ON public.companies FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own company"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company"
    ON public.companies FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any company"
    ON public.companies FOR UPDATE
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete companies"
    ON public.companies FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Colleges RLS policies (public read, admin write)
CREATE POLICY "Anyone can view active colleges"
    ON public.colleges FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can view all colleges"
    ON public.colleges FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert colleges"
    ON public.colleges FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update colleges"
    ON public.colleges FOR UPDATE
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete colleges"
    ON public.colleges FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Hiring drives RLS policies
CREATE POLICY "Company can view own drives"
    ON public.hiring_drives FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.companies 
        WHERE companies.id = hiring_drives.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Admins can view all drives"
    ON public.hiring_drives FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Company can insert own drives"
    ON public.hiring_drives FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.companies 
        WHERE companies.id = company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Company can update own drives"
    ON public.hiring_drives FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.companies 
        WHERE companies.id = hiring_drives.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Admins can update any drive"
    ON public.hiring_drives FOR UPDATE
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Company can delete own drives"
    ON public.hiring_drives FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.companies 
        WHERE companies.id = hiring_drives.company_id 
        AND companies.user_id = auth.uid()
    ));

CREATE POLICY "Admins can delete any drive"
    ON public.hiring_drives FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- If email is whitelisted admin, grant admin role
    IF public.is_whitelisted_admin(NEW.email) THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin');
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at
    BEFORE UPDATE ON public.colleges
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hiring_drives_updated_at
    BEFORE UPDATE ON public.hiring_drives
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();