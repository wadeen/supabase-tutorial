import { Database } from "@/lib/supabase";

type Props = {
  todoText: Database[];
  onClickRemoveTodo: (id: number) => void;
};

const TodoList = ({ todoText, onClickRemoveTodo }: Props) => {
  return (
    <ul>
      {todoText.map((item: Database) => (
        <li key={item.id}>
          {/* <input type="checkbox" checked={item.isDone} onClick={onClickTodoCheck} /> */}
          {item.text}
          <button onClick={() => onClickRemoveTodo(item.id!)}>削除</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
