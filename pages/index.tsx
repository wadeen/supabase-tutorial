import styles from "@/styles/Home.module.css";
import { Database } from "@/lib/supabase";
import { getList, updateLunch } from "@/lib/service";
import { useEffect, useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [todoText, setTodoText] = useState<Database[]>([]);

  const fetchSample = async () => {
    const sampleData = await getList();
    setTodoText(() => sampleData as Database[]);
  };

  useEffect(() => {
    fetchSample();
  }, []);

  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setInputText(() => inputText);
  };

  const onClickAddTodo = () => {
    if (inputText === "") return;
    updateLunch({ lunch: inputText, isDone: false });
    fetchSample();
    setInputText(() => "");
  };

  return (
    <>
      {/* 追加エリア */}
      <div>
        <input type="text" name="todo" value={inputText} onChange={onChangeInputText} />
        <button type="button" onClick={onClickAddTodo} disabled={inputText === ""}>
          追加
        </button>
      </div>

      {/* 表示エリア */}
      <ul>
        {todoText.map((item: Database) => (
          <li key={item.id}>{item.lunch}</li>
        ))}
      </ul>
    </>
  );
}
