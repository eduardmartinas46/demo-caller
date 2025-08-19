/*
  # Create visitors table with proper error handling

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `created_at` (timestamp with timezone)
      - `slug` (text, unique, not null)
      - `system` (text, default empty string)
      - `first_message` (text, default empty string)

  2. Security
    - Enable RLS on visitors table
    - Add policy for public read access (drop if exists first)
*/

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  slug text UNIQUE NOT NULL,
  system text NOT NULL DEFAULT ''::text,
  first_message text NOT NULL DEFAULT ''::text
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists and recreate it
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON public.visitors;
  
  CREATE POLICY "Allow public read access"
    ON public.visitors
    FOR SELECT
    TO public
    USING (true);
END $$;