import { useMemo, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor)
  );
  return (
    <div className="m-auto min-h-screen w-full overflow-x-auto overflow-y-hidden flex  items-center px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
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
                  />
                );
              })}
            </SortableContext>
          </div>
          <button
            onClick={() => CreateNewColumn()}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-2 ring-rose-500 hover:ring-2 flex gap-2 items-center"
          >
            <PlusIcon /> Add Column
          </button>
        </div>

        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              deleteColumn={deleteColumn}
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
    console.log(id);
    const filteredColumns = columns.filter((col) => col.id !== id);
    console.log(filteredColumns);
    setColumns(filteredColumns);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current?.column);

      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
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
}
function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
