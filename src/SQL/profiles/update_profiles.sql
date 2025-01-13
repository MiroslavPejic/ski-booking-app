INSERT INTO profiles (id, role, name)
SELECT id, 'customer', email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
