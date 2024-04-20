import supabase from "./supabase";

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error("login failed");
  }

  console.log(data);
  return data;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error("logout failed");
  }
}
