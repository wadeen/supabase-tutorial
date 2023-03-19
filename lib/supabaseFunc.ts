import { useState } from "react";
import supabase from "./supabase";
import { Database } from "./supabase";

export const TABLE_NAME = "sample";

// データの取得
export const fetchDatabase = async () => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("created_at");
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
  }
};

// データの追加
export const addSupabaseData = async ({ id, text, isDone }: Database) => {
  try {
    await supabase.from(TABLE_NAME).insert({ id, text, isDone });
  } catch (error) {
    console.error(error);
  }
};

// データの削除
export const removeSupabaseData = async (id: number) => {
  try {
    await supabase.from(TABLE_NAME).delete().match({ id });
  } catch (error) {
    console.error(error);
  }
};
