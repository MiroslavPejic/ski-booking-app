CREATE TABLE ski_lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_date TIMESTAMP NOT NULL,
  lesson_time TIME NOT NULL,
  lesson_duration INT NOT NULL DEFAULT 1,  -- New column for lesson duration
  lesson_type TEXT NOT NULL,
  location_id INT REFERENCES locations(id) ON DELETE SET NULL,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  deleted BOOLEAN DEFAULT FALSE
);
