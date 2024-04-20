import supabase from "./supabase";

export async function getLeatherBoards() {
  const { data, error } = await supabase.from("leatherboards").select("*");

  if (error) {
    console.error(error);
    throw new Error("leatherboards could not be loaded");
  }

  return data;
}

export async function deleteLeatherBoard(id) {
  const { error } = await supabase.from("leatherboards").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("leatherboards could not be deleted");
  }
}

export async function createLeatherBoard(data) {
  const { error } = await supabase.from("leatherboards").insert([data]);
  if (error) {
    console.error(error);
    throw new Error("leatherboards could not be created");
  }
}

export async function getUsernameColumn() {
  const { data: leatherboards, error } = await supabase.from("leatherboards").select("username");

  if (error) {
    console.error(error);
    throw new Error("leatherboards could not be loaded");
  }
  return leatherboards;
}
