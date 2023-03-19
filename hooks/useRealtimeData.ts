import supabase, { Database } from "@/lib/supabase";
import { useState, useEffect } from "react";
// DBのリアルタイム反映

const TABLE_NAME = "sample";

export const useRealtimeData = (todoData: Database[]) => {
  const [todoTexts, setTodoText] = useState<Database[]>([]); // 更新データ（ToDoリスト一覧）

  try {
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
            console.log("todoText: ", todoTexts);
            setTodoText((todoTexts) => todoTexts.filter((todo) => todo.id !== payload.old.id));
          }
          if (payload.eventType === "INSERT") {
            console.log("todoText: ", todoTexts);
            const { created_at, id, isDone, text } = payload.new;
            setTodoText((todoTexts) => [...todoTexts, { created_at, id, isDone, text }]);
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

  return;
};
