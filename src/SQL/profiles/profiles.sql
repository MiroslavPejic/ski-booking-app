CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'customer');

CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    role user_role NOT NULL,
    name TEXT,
    location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    is_deleted boolean DEFAULT false
);