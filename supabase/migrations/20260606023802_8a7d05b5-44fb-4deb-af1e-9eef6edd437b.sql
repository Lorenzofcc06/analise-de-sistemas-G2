
-- Enums
CREATE TYPE public.user_type AS ENUM ('produtor', 'comprador', 'ambos');
CREATE TYPE public.animal_category AS ENUM ('bovino', 'equino', 'ovino', 'caprino', 'suino', 'aves', 'outros');
CREATE TYPE public.animal_sex AS ENUM ('macho', 'femea');
CREATE TYPE public.listing_status AS ENUM ('ativo', 'pausado', 'vendido');

-- Helper: timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  city TEXT,
  state TEXT,
  user_type public.user_type NOT NULL DEFAULT 'comprador',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, city, state, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'comprador')
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Animals
CREATE TABLE public.animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category public.animal_category NOT NULL,
  breed TEXT,
  sex public.animal_sex,
  age_months INTEGER,
  weight_kg NUMERIC(10,2),
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(12,2) NOT NULL,
  price_per_unit BOOLEAN NOT NULL DEFAULT false,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  status public.listing_status NOT NULL DEFAULT 'ativo',
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.animals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.animals TO authenticated;
GRANT ALL ON public.animals TO service_role;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active animals are viewable by everyone" ON public.animals
FOR SELECT USING (status = 'ativo' OR auth.uid() = owner_id);
CREATE POLICY "Users can create their own animals" ON public.animals
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their animals" ON public.animals
FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their animals" ON public.animals
FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TRIGGER trg_animals_updated_at BEFORE UPDATE ON public.animals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_animals_category ON public.animals(category);
CREATE INDEX idx_animals_status ON public.animals(status);
CREATE INDEX idx_animals_owner ON public.animals(owner_id);
CREATE INDEX idx_animals_created ON public.animals(created_at DESC);
