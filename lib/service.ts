import supabase from "./supabase";

const TABLE_NAME = "sample";

// データの取得
export const getList = async () => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("created_at");
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

// データの更新
export const updateLunch = async ({ id, lunch, isDone }: any) => {
  try {
    await supabase.from(TABLE_NAME).insert({ id, lunch, is_done: isDone });
  } catch (error) {
    console.error(error);
  }
};
