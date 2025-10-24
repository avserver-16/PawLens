-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('pet_owner', 'veterinarian');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create veterinarian_profiles table
CREATE TABLE public.veterinarian_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialization TEXT,
  clinic_name TEXT,
  clinic_address TEXT,
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.veterinarian_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vet profiles"
  ON public.veterinarian_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vets can update their own profile"
  ON public.veterinarian_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Vets can insert their own profile"
  ON public.veterinarian_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'veterinarian'));

-- Create pet_profiles table
CREATE TABLE public.pet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  medical_history TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pet_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their own pets"
  ON public.pet_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own pets"
  ON public.pet_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'pet_owner'));

CREATE POLICY "Owners can update their own pets"
  ON public.pet_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Vets can view all pets"
  ON public.pet_profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'veterinarian'));

-- Create diagnoses table
CREATE TABLE public.diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pet_profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_description TEXT NOT NULL,
  image_url TEXT,
  ai_diagnosis TEXT,
  disease_name TEXT,
  severity TEXT,
  should_consult_doctor BOOLEAN,
  consultation_reason TEXT,
  cure_suggestions TEXT,
  home_remedies TEXT,
  status TEXT DEFAULT 'pending',
  assigned_vet_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their own diagnoses"
  ON public.diagnoses FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own diagnoses"
  ON public.diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'pet_owner'));

CREATE POLICY "Owners can update their own diagnoses"
  ON public.diagnoses FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Vets can view all diagnoses"
  ON public.diagnoses FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'veterinarian'));

CREATE POLICY "Vets can update diagnoses"
  ON public.diagnoses FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'veterinarian'));

-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload pet images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view pet images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'pet-images');

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update timestamp trigger function
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
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vet_profiles_updated_at
  BEFORE UPDATE ON public.veterinarian_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pet_profiles_updated_at
  BEFORE UPDATE ON public.pet_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnoses_updated_at
  BEFORE UPDATE ON public.diagnoses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();