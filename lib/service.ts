import { useState } from "react";
import supabase from "./supabase";
import { Database } from "./supabase";

const TABLE_NAME = "sample";

// データの取得

// データの更新
export const updateLunch = async ({ id, lunch, isDone }: Database) => {
  try {
    await supabase.from(TABLE_NAME).insert({ id, lunch, isDone });
  } catch (error) {
    console.error(error);
  }
};

// データの更新
export const removeLunch = async (id: number) => {
  try {
    await supabase.from(TABLE_NAME).delete().match({ id });
  } catch (error) {
    console.error(error);
  }
};
