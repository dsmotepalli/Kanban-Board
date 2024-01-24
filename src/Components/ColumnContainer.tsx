import { useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../Icons/DeleteIcon";
import { Column, Id } from "../types";

import { CSS } from "@dnd-kit/utilities";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn } = props;
  const { attributes, listeners, setNodeRef, transform, isDragging,transition } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
    });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };
  if(isDragging){
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
        className="bg-mainBackgroundColor text-xl h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-4 border-columnBackgroundColor flex items-center justify-between"
      >
        <div className=" flex gap-4">
          <div className="bg-columnBackgroundColor flex  justify-center items-center px-2 py-1 text-sm rounded-full">
            0
          </div>
          {column.title}
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
      <div className="flex flex-grow">conster</div>
      {/* column footer */}
      <div>fppter</div>
    </div>
  );
}

export default ColumnContainer;
