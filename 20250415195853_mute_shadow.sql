/*
  # Add first_message field to visitors table

  1. Changes
    - Add `first_message` column (text) to visitors table
    - Set default value to empty string

  2. Security
    - Maintain existing RLS settings
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visitors' AND column_name = 'first_message'
  ) THEN 
    ALTER TABLE visitors ADD COLUMN first_message text NOT NULL DEFAULT '';
  END IF;
END $$;