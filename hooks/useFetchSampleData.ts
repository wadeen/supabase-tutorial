import supabase from "@/lib/supabase";
import { useState } from "react";
import { Database } from "@/lib/supabase";

const TABLE_NAME = "sample";

// データの取得
export const useFetchSampleData = async () => {
  const [todoText, setTodoText] = useState<Database[]>([]); // 入力テキスト
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("created_at");
    if (error) throw new Error(error.message);

    setTodoText(data as Database[]); // '{ [x: string]: any; }[] | null'

    supabase
      .channel("table_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // "INSERT" | "UPDATE" | "DELETE" 条件指定可能
          schema: "public",
          table: TABLE_NAME,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setTodoText((todoText) => todoText.filter((todo) => todo.id !== payload.old.id));
          }
          if (payload.eventType === "INSERT") {
            const { created_at, id, isDone, lunch } = payload.new;
            setTodoText((todoText) => [...todoText, { created_at, id, isDone, lunch }]);
          }
        }
      )
      .subscribe();

    // リスナーの解除
    return () => {
      supabase.channel("table_postgres_changes").unsubscribe();
    };
  } catch (error) {
    console.error(error);
  }
  console.log("todoText: ", todoText);
  return { todoText };
};
