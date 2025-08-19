/*
  # Insert John Doe test record

  1. New Records
    - Insert a test visitor record for "John Doe"
    - Set slug to "john" for easy access
    - Add default system message and first message for testing

  2. Purpose
    - Provides a test record to verify the application functionality
    - Allows testing the personalized demo page at /john
*/

INSERT INTO visitors (name, slug, system, first_message)
VALUES (
  'John Doe',
  'john',
  'You are a helpful AI assistant representing a customer service automation tool. You should be friendly, professional, and focus on explaining how the AI phone system can help businesses automate their customer service calls.',
  'Hi John! Thanks for checking out our AI customer service demo. I''m here to show you how our system can handle your customer calls automatically. What questions do you have about automating your customer service?'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  system = EXCLUDED.system,
  first_message = EXCLUDED.first_message;