export type Id = number;
export type Column = {
  id: Id;
  title: string;
};
export type Task = {
  id: Id;
  content: string;
  columnId: Id;
};
