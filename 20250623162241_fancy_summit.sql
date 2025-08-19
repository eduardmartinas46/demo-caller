/*
  # Add sample visitor data

  1. Sample Data
    - Add a default visitor record for testing
    - Includes sample system prompt and first message

  2. Purpose
    - Ensures the app has data to display
    - Prevents "page not found" error on default route
*/

-- Insert sample visitor data
INSERT INTO public.visitors (name, slug, system, first_message)
VALUES (
  'Demo User',
  'default',
  'You are a helpful AI assistant that specializes in customer service. Be friendly, professional, and concise in your responses. Help customers with their questions and guide them toward solutions.',
  'Hi there! Thanks for trying out this AI phone assistant demo. How can I help you today?'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  system = EXCLUDED.system,
  first_message = EXCLUDED.first_message;