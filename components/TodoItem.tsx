import { Database } from "@/lib/supabasetjs";
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
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          onClickTodoCheck(item.id!, !isChecked);
          setIsChecked(() => !isChecked);
        }}
      />
      {item.text}
      <button onClick={() => onClickRemoveTodo(item.id!)}>削除</button>
    </li>
  );
};

export default TodoItem;
