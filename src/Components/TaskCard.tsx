import { useState } from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import { Id, Task } from "../types";

interface Props {
  task: Task;
  deleteTask:(id:Id)=>void;
}

function TaskCard({ task, deleteTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  return (
    <div
      className="bg-mainBackgroundColor p-2 h-[100px] min-h-[100px] items-center text-left flex rounded-xl hover:ring-2 hover:ring-rose-500 hover:ring-inset cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {task.content}
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor rounded p-2 opacity-60 hover:opacity-100"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
