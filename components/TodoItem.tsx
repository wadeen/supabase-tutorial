import { Database } from "@/lib/supabase";
import { useState } from "react";

type Props = {
  item: Database;
  onClickRemoveTodo: (id: number) => void;
  onClickTodoCheck: (id: number, isDone: boolean) => void;
};

const TodoItem = ({ item, onClickRemoveTodo, onClickTodoCheck }: Props) => {
  const [isChecked, setIsChecked] = useState(item.isDone); // チェックボックスの状態

  return (
    <li>
      <input type="checkbox" checked={isChecked} onChange={(isChecked) => setIsChecked(!isChecked)} onClick={() => onClickTodoCheck(item.id!, isChecked)} />
      {item.text}
      <button onClick={() => onClickRemoveTodo(item.id!)}>削除</button>
    </li>
  );
};

export default TodoItem;