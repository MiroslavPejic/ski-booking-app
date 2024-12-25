create table ski_lessons (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  lesson_date timestamp not null,
  lesson_type text not null,
  location text
);
