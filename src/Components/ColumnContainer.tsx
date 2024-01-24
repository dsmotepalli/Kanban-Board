import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../Icons/DeleteIcon";
import { Column, Id, Task } from "../types";

import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  UpdateColumnTitle: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  Tasks: Task[];

 
}

function ColumnContainer({
  column,
  deleteColumn,
  UpdateColumnTitle,
  createTask,
  Tasks,
  deleteTask,
  updateTaskContent,
 
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const tasksId = useMemo(() => Tasks.map((task) => task.id), [Tasks]);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
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
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500 "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* column title */}
      <div
        {...listeners}
        {...attributes}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-xl h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-4 border-columnBackgroundColor flex items-center justify-between"
      >
        <div className=" flex gap-4">
          <div className="bg-columnBackgroundColor flex  justify-center items-center px-2 py-1 text-sm rounded-full">
            0
          </div>

          {editMode ? (
            <input
              className="bg-mainBackgroundColor border-2 focus:border-rose-500 rounded outline-none"
              value={column.title}
              autoFocus
              onChange={(e) => UpdateColumnTitle(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          ) : (
            column.title
          )}
        </div>
        <div>
          <button
            onClick={() => deleteColumn(column.id)}
            className="stroke-slate-500 hover:stroke-white cursor-pointer hover:bg-columnBackgroundColor px-1 py-1 rounded"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      {/* column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {Tasks.map((task) => (
            <TaskCard
              updateTaskContent={updateTaskContent}
              deleteTask={deleteTask}
              key={task.id}
              task={task}
            />
          ))}
        </SortableContext>
      </div>
      {/* column footer */}
      <button
        onClick={() => createTask(column.id)}
        className="border-columnBackgroundColor border-2 flex p-4 items-center justify-center gap-4 hover:bg-mainBackgroundColor hover:text-rose-500"
      >
        <PlusIcon />
        Add Task
      </button>
      
    </div>
  );
}

export default ColumnContainer;
