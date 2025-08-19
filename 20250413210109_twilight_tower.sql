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

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON visitors
  FOR SELECT
  TO public
  USING (true);