import styles from "@/styles/Home.module.css";
import supabase, { Database } from "@/lib/supabase";
import { removeLunch, updateLunch } from "@/lib/service";
import { useCallback, useEffect, useState } from "react";

const TABLE_NAME = "sample";

export default function Home() {
  const [inputText, setInputText] = useState(""); // 入力テキスト
  const [todoText, setTodoText] = useState<Database[]>([]); // 入力テキスト

  const fetchSampleData = async () => {
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
  };

  // 入力テキスト
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(() => event.target.value);
  };

  // ToDoの追加
  const onSubmitAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputText === "") return;
    updateLunch({ lunch: inputText, isDone: false });
    setInputText(() => "");
  };

  // ToDoの削除
  const onClickRemoveTodo = (id: number) => {
    const isPublished = window.confirm("本当に削除してもいいですか？この操作は取り消せません。");
    if (!isPublished) return;
    removeLunch(id);
  };

  useEffect(() => {
    fetchSampleData();
  }, []);

  return (
    <>
      {/* 追加エリア */}
      <form onSubmit={onSubmitAddTodo}>
        <input type="text" name="todo" value={inputText} onChange={onChangeInputText} />
        <button type="submit" disabled={inputText === ""}>
          追加
        </button>
      </form>

      {/* 表示エリア */}
      {todoText ? (
        <ul>
          {todoText.map((item: any) => (
            <li key={item.id}>
              {/* <input type="checkbox" checked={item.isDone} onClick={onClickTodoCheck} /> */}
              {item.lunch}
              <button onClick={() => onClickRemoveTodo(item.id!)}>削除</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
