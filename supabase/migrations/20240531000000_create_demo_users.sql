-- Create demo users with their corresponding roles
INSERT INTO public.users (id, name, phone, role, password_hash, created_at)
VALUES 
  ('admin1', 'Admin User', 'admin', 'admin', 'admin123', CURRENT_TIMESTAMP),
  ('agent1', 'Agent User', 'agent', 'agent', 'agent123', CURRENT_TIMESTAMP),
  ('driver1', 'John Doe', 'john', 'driver', 'john123', CURRENT_TIMESTAMP),
  ('helper1', 'Helper One', 'helper1', 'helper', 'helper123', CURRENT_TIMESTAMP),
  ('cleaner1', 'Cleaner One', 'cleaner1', 'cleaner', 'cleaner123', CURRENT_TIMESTAMP),
  ('customer1', 'Customer One', 'customer', 'customer', 'customer123', CURRENT_TIMESTAMP);

-- Create worker profiles for service providers
INSERT INTO public.worker_profiles (id, user_id, name, phone, worker_type, created_at, is_active)
VALUES
  ('wp_driver1', 'driver1', 'John Doe', 'john', 'driver', CURRENT_TIMESTAMP, true),
  ('wp_helper1', 'helper1', 'Helper One', 'helper1', 'helper', CURRENT_TIMESTAMP, true),
  ('wp_cleaner1', 'cleaner1', 'Cleaner One', 'cleaner1', 'cleaner', CURRENT_TIMESTAMP, true);

-- Create agent profile
INSERT INTO public.agents (id, user_id, name, phone, email, is_active, commission_rate, total_earnings, registered_services, status, created_at, registered_on)
VALUES
  ('agent1', 'agent1', 'Agent User', 'agent', 'agent@example.com', true, 10.0, 0, ARRAY['moving', 'cleaning'], 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
