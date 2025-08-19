/*
  # Create visitors table
  
  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `created_at` (timestamp with timezone)
  
  2. Security
    - Enable RLS on visitors table
    - Add policy for authenticated users to read all visitors
*/

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists and recreate it
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON visitors;
  
  CREATE POLICY "Allow public read access"
    ON visitors
    FOR SELECT
    TO public
    USING (true);
END $$;