import KanbanBoard from "./Components/KanbanBoard";

function App() {
  return (
    <div id="root">
      <div className="absolute top-6 left-[600px] text-3xl text-rose-600 font-bold font-serif">
        Kanban Board
      </div>
      <KanbanBoard />
      <div className="absolute bottom-2 left-[675px]  text-rose-600 font-bold font-mono">
        Made by{" "}
        <a
          href="https://github.com/dsmotepalli"
          target="_blank"
          className="underline"
        >
          Deepak
        </a>
      </div>
    </div>
  );
}

export default App;
