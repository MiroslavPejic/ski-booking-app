import supabase from '../supabaseClient';

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, is_deleted, locations (name)')
    .eq('is_deleted', false)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const fetchLocations = async () => {
  const { data, error } = await supabase.from('locations').select('*');

  if (error) throw new Error(error.message);

  return data;
};

export const deleteUser = async (userId) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_deleted: true })
    .eq('id', userId);

  if (error) throw new Error(error.message);
};

export const updateUserRole = async (userId, newRole) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) throw new Error(error.message);
};
