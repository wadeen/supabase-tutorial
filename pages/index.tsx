import TodoList from "@/components/TodoList";
import supabase, { Database } from "@/lib/supabase";
import { fetchDatabase, removeSupabaseData, addSupabaseData, TABLE_NAME } from "@/lib/supabaseFunc";
import { useEffect, useState } from "react";
// import { useRealtimeData } from "@/hooks/useRealtimeData";

export default function Index() {
  const [inputText, setInputText] = useState(""); // 入力テキスト
  const [todoText, setTodoText] = useState<Database[]>([]); // ToDoリスト一覧

  // 入力テキスト
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => setInputText(() => event.target.value);

  // ToDoの追加
  const onSubmitAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputText === "") return;
    addSupabaseData({ text: inputText, isDone: false });
    setInputText(() => "");
  };

  // ToDoの削除
  const onClickRemoveTodo = (id: number) => {
    const isPublished = window.confirm("本当に削除してもいいですか？この操作は取り消せません。");
    if (!isPublished) return;
    removeSupabaseData(id);
  };

  // リアルタイムデータ更新
  const fetchRealtimeData = () => {
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
              setTodoText((todoText) => todoText.filter((todo) => todo.id !== payload.old.id));
            }
            if (payload.eventType === "INSERT") {
              const { created_at, id, isDone, text } = payload.new;
              setTodoText((todoText) => [...todoText, { created_at, id, isDone, text }]);
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

  useEffect(() => {
    (async () => {
      const todo = await fetchDatabase();
      setTodoText(todo as Database[]); // '{ [x: string]: any; }[] | null'
    })();
    fetchRealtimeData();
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
      {todoText ? <TodoList onClickRemoveTodo={onClickRemoveTodo} todoText={todoText} /> : <p>Loading...</p>}
    </>
  );
}
