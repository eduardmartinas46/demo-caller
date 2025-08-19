/*
  # Add page fields to visitors table

  1. Changes
    - Add `slug` column (text, unique) to visitors table
    - Add `system` column (text) to visitors table
    - Update RLS policy to allow public read access

  2. Security
    - Maintain existing RLS settings
    - Update policy for new columns
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visitors' AND column_name = 'slug'
  ) THEN 
    ALTER TABLE visitors ADD COLUMN slug text UNIQUE NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visitors' AND column_name = 'system'
  ) THEN 
    ALTER TABLE visitors ADD COLUMN system text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Update or create the policy to include new columns
DROP POLICY IF EXISTS "Allow public read access" ON visitors;
CREATE POLICY "Allow public read access"
  ON visitors
  FOR SELECT
  TO public
  USING (true);