-- SQL for Analytics and Tech Tags

-- 1. Add tech_stack (tags) to education and experience if not exists
ALTER TABLE education ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}';
ALTER TABLE experience ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}';

-- 2. Create traffic_stats table for accurate analytics
CREATE TABLE IF NOT EXISTS public.traffic_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    path text NOT NULL,
    referrer text,
    user_agent text,
    ip_hash text -- Storing hash for privacy while allowing unique visitor counting
);

-- 3. Enable RLS and public insert (for tracking)
ALTER TABLE public.traffic_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert of traffic stats" 
ON public.traffic_stats FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin view of traffic stats" 
ON public.traffic_stats FOR SELECT 
USING (auth.role() = 'authenticated');
