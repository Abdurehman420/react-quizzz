import supabase from "./supabase";

export async function getQuestions() {
  const { data, error } = await supabase.from("questions").select("*");

  if (error) {
    console.error(error);
    throw new Error("questions could not be loaded");
  }

  return data;
}

export async function createQuestion(data) {
  const { error } = await supabase.from("questions").insert([data]);

  if (error) {
    console.error(error);
    throw new Error("questions could not be created");
  }
}
