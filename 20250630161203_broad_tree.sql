/*
  # Restore default visitor record

  1. Purpose
    - Re-insert the default visitor record that was accidentally deleted
    - Ensures the root URL shows proper demo page instead of "page not found"

  2. Data
    - Insert default visitor with slug 'default'
    - Include appropriate system prompt and first message
    - Use ON CONFLICT to handle if record already exists
*/

INSERT INTO public.visitors (name, slug, system, first_message)
VALUES (
  'Visitor',
  'default',
  'You are a helpful AI assistant that specializes in customer service automation. You represent a cutting-edge phone AI system that can handle customer calls automatically. Be friendly, professional, and enthusiastic about helping businesses automate their customer service. Focus on explaining how AI can improve customer experience while reducing operational costs.',
  'Hello! Thanks for trying out this AI customer service demo. I''m an AI assistant that can handle phone calls for businesses automatically. I can answer questions, help customers, and provide support 24/7. What would you like to know about AI-powered customer service?'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  system = EXCLUDED.system,
  first_message = EXCLUDED.first_message,
  created_at = now();