"use client";

import RequireAuth from "@/components/RequireAuth";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { ApiError, apiFetch } from "@/lib/api";
import { PaginatedTask, Task } from "@/lib/types";
import { useEffect, useState, Fragment } from "react";

const FETCH_TASKS_API_PATH = "/api/tasks";

export default function page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function showSuccessMsg(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 1000);
  }

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<PaginatedTask>(FETCH_TASKS_API_PATH, {
        method: "GET",
      });
      setTasks(res.items);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(taskId: string) {
    try {
      setError(null);
      await apiFetch(`${FETCH_TASKS_API_PATH}/${taskId}`, { method: "DELETE" });
      setTasks((tasks) => tasks.filter((t) => t.id !== taskId));
      showSuccessMsg("Task moved successfully.");
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("Something went wrong. Please try later.");
      }
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <RequireAuth>
      <div className="w-xl flex flex-col items-center mx-auto py-8 px-4 pt-16">
        <h1 className="text-xl font-bold my-8">My Tasks</h1>
        <div className="w-full px-4">
          <TaskForm
            mode="create"
            onCreated={() => {
              showSuccessMsg("Task is created.");
              fetchTasks();
            }}
          />
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
              {error}
            </div>
          )}
          {loading && <div>Loading tasks...</div>}
          {successMsg && (
            <div className="flex items-center w-full max-w-sm p-4">
              <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 bg-green-50 rounded">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 11.917 9.724 16.5 19 7.5"
                  />
                </svg>
              </div>
              <div className="ms-3 text-sm font-normal">{successMsg}</div>
            </div>
          )}
          <div className="flex flex-col space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <Fragment key={task.id}>
                  {editingId === task.id ? (
                    <TaskForm
                      mode="update"
                      taskId={task.id}
                      initValues={{
                        title: task.title,
                        status: task.status,
                        priority: task.priority,
                        due_datetime: task.due_datetime,
                      }}
                      onSave={() => {
                        setEditingId(null);
                        fetchTasks();
                        showSuccessMsg("Task is updated.");
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="flex flex-row items-center justify-center">
                      <div
                        onClick={() => setEditingId(task.id)}
                        className="cursor-pointer w-lg flex items-center px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-700"
                        tabIndex={idx}
                      >
                        <TaskCard task={task} />
                      </div>

                      <button
                        onClick={async () => {
                          await deleteTask(task.id);
                        }}
                        className="ms-4 cursor-pointer border border-gray-200 rounded-full p-2 hover:bg-gray-200"
                      >
                        <svg
                          className="w-4 h-4 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18 17.94 6M18 18 6.06 6"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </Fragment>
              ))
            ) : (
              <div className="text-center text-xl">
                You currently don't have any tasks.
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
