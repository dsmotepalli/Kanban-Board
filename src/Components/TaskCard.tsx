import { useState } from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTaskContent }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor p-2 h-[100px] min-h-[100px] items-center text-left flex rounded-xl border-2 border-rose-500 opacity-35 hover:ring-inset cursor-grab relative"
      ></div>
    );
  }
  const toggleEdiMode = () => {
    setEditMode((p) => !p);
    setMouseIsOver(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-mainBackgroundColor p-2 h-[100px] min-h-[100px] items-center text-left flex rounded-xl hover:ring-2 hover:ring-rose-500 hover:ring-inset cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={() => setEditMode(true)}
    >
      {editMode ? (
        <textarea
          autoFocus
          value={task.content}
          className="bg-transparent text-white h-[90%] w-full outline-none resize-none border-none rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              toggleEdiMode();
            }
          }}
          onChange={(e) => updateTaskContent(task.id, e.target.value)}
          onBlur={() => {
            toggleEdiMode();
          }}
        ></textarea>
      ) : (
        <p className="h-[90%] my-auto overflow-y-auto overflow-x-hidden w-full whitespace-pre-wrap">
          {task.content}
        </p>
      )}

      {mouseIsOver && !editMode && (
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
