-- Enable Row Level Security
-- Supabase Schema for Signal Workflows

-- 1. Create Resources Table
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    claim TEXT NOT NULL,
    description TEXT NOT NULL,
    impressive_numbers TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false NOT NULL,
    upvotes_count INTEGER DEFAULT 0 NOT NULL
);

-- 2. Create Upvotes Table (to track who upvoted what)
CREATE TABLE public.upvotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(resource_id, user_id) -- A user can only upvote a resource once
);

-- 3. Set up Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- Resources Policies
-- Anyone can view approved resources
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.resources FOR SELECT 
USING (is_approved = true);

-- Authenticated users can insert resources
CREATE POLICY "Authenticated users can insert resources" 
ON public.resources FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own unapproved resources
CREATE POLICY "Users can update own resources" 
ON public.resources FOR UPDATE 
USING (auth.uid() = user_id);

-- Upvotes Policies
-- Anyone can read upvotes
CREATE POLICY "Upvotes are viewable by everyone" 
ON public.upvotes FOR SELECT 
USING (true);

-- Authenticated users can insert upvotes
CREATE POLICY "Authenticated users can upvote" 
ON public.upvotes FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own upvotes (remove upvote)
CREATE POLICY "Users can delete own upvotes" 
ON public.upvotes FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create function to increment/decrement upvote counts automatically
CREATE OR REPLACE FUNCTION handle_upvote()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.resources
        SET upvotes_count = upvotes_count + 1
        WHERE id = NEW.resource_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.resources
        SET upvotes_count = upvotes_count - 1
        WHERE id = OLD.resource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for upvote insertion/deletion
CREATE TRIGGER on_upvote_change
    AFTER INSERT OR DELETE ON public.upvotes
    FOR EACH ROW EXECUTE PROCEDURE handle_upvote();
