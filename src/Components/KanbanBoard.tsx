import { useEffect, useMemo, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [Tasks, setTasks] = useState<Task[]>([]);
  console.log(JSON.stringify(columns));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    // Load data from localStorage when the component mounts
    const storedColumns = localStorage.getItem("columns");
    const storedTasks = localStorage.getItem("tasks");

    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
    localStorage.setItem("tasks", JSON.stringify(Tasks));
  }, [columns, Tasks]);

  return (
    <div className="m-auto min-h-screen w-full overflow-x-auto overflow-y-hidden flex  items-center px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columsId}>
              {columns.map((col) => {
                return (
                  <ColumnContainer
                    key={col.id}
                    deleteColumn={deleteColumn}
                    column={col}
                    UpdateColumnTitle={UpdateColumnTitle}
                    createTask={createTask}
                    Tasks={Tasks.filter((task) => task.columnId === col.id)}
                    deleteTask={deleteTask}
                    updateTaskContent={updateTaskContent}
                  />
                );
              })}
            </SortableContext>
          </div>
          <button
            onClick={() => CreateNewColumn()}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-2 ring-rose-500 hover:ring-2 flex gap-2 items-center hover:ring-inset"
          >
            <PlusIcon /> Add Column
          </button>
        </div>

        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              deleteColumn={deleteColumn}
              UpdateColumnTitle={UpdateColumnTitle}
              createTask={createTask}
              Tasks={Tasks.filter((task) => task.id === activeColumn.id)}
              deleteTask={deleteTask}
              updateTaskContent={updateTaskContent}
            />
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
              deleteTask={deleteTask}
              updateTaskContent={updateTaskContent}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
  function CreateNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);

    setColumns(filteredColumns);
    // deleting a column should delete the tasks associated with the column
    const newTasks = Tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current?.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current?.task);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    console.log(active, over);
    if (active.id !== over?.id) {
      setColumns((columns: Column[]) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === active.id
        );
        const overColumnIndex = columns.findIndex((col) => col.id === over?.id);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }
  function UpdateColumnTitle(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      content: `Task ${Tasks.length + 1}`,
      columnId,
    };
    setTasks([...Tasks, newTask]);
  }
  function deleteTask(id: Id) {
    const newTasks = Tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }
  function updateTaskContent(id: Id, content: string) {
    const newTasks: Task[] = Tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // droping a task over a task
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over?.data.current?.type === "Task";
    if (isActiveATask && isOverATask) {
      setTasks((tasks: Task[]) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === active.id
        );
        const overTaskIndex = tasks.findIndex((task) => task.id === over.id);

        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === active.id
        );
        tasks[activeTaskIndex].columnId = over.id as number;
        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  }
}
function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
