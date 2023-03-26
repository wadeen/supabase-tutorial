import TodoItem from "@/components/TodoItem";
import supabase, { Database } from "@/lib/supabase";
import { fetchDatabase, removeSupabaseData, addSupabaseData, TABLE_NAME, updateSupabaseData } from "@/lib/supabaseFunc";
import { useEffect, useState } from "react";

export default function Index() {
  const [inputText, setInputText] = useState(""); // 入力テキスト
  const [todoText, setTodoText] = useState<Database[]>([]); // ToDoリストの一覧

  // 入力テキスト
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => setInputText(() => event.target.value);

  // ToDoの追加
  const onSubmitAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputText === "") return;
    addSupabaseData({ text: inputText, isDone: false }); // DBに追加
    setInputText(() => "");
  };

  // ToDoの削除
  const onClickRemoveTodo = (id: number) => {
    const isPublished = window.confirm("本当に削除してもいいですか？この操作は取り消せません。");
    if (!isPublished) return;
    removeSupabaseData(id);
  };

  // ToDoのチェック
  const onClickTodoCheck = (id: number, isDone: boolean) => {
    updateSupabaseData(id, isDone);
  };

  // リアルタイムデータ更新
  const fetchRealtimeData = () => {
    try {
      supabase
        .channel("table_postgres_changes") // 任意のチャンネル名
        .on(
          "postgres_changes", // ここは固定
          {
            event: "*", // "INSERT" | "DELETE" | "UPDATE"  条件指定が可能
            schema: "public",
            table: TABLE_NAME, // DBのテーブル名
          },
          (payload) => {
            // データ登録
            if (payload.eventType === "INSERT") {
              const { createdAt, id, isDone, text } = payload.new;
              setTodoText((todoText) => [...todoText, { createdAt, id, isDone, text }]);
            }
            // データ削除
            if (payload.eventType === "DELETE") {
              setTodoText((todoText) => todoText.filter((todo) => todo.id !== payload.old.id));
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
      {todoText ? (
        <ul>
          {todoText.map((item: Database) => (
            <TodoItem key={item.id} onClickRemoveTodo={onClickRemoveTodo} onClickTodoCheck={onClickTodoCheck} item={item} />
          ))}
        </ul>
      ) : (
        <p>ToDoリストを追加してください📝</p>
      )}
    </>
  );
}
