export type User = {
  id: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  status: "TODO" | "DONE";
  priority: "HIGH" | "MEDIUM" | "LOW";
  due_datetime: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedTask = {
  items: [Task];
  total: number;
  limit: number;
  offset: number;
};
