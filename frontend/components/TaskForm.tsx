import { ApiError, apiFetch } from "@/lib/api";
import {
  TaskCreateFormInput,
  TaskCreateInput,
  taskCreateSchema,
  TaskUpdateFormInput,
  TaskUpdateInput,
  taskUpdateSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const TASK_API_PATH = "/api/tasks";

type initValuesInput = {
  title: string;
  status: "TODO" | "DONE";
  priority: "HIGH" | "MEDIUM" | "LOW";
  due_datetime?: string;
};

export default function TaskForm({
  mode = "create",
  taskId,
  initValues,
  onCreated,
  onSave,
  onCancel,
}: {
  mode: "create" | "update";
  taskId?: string | null;
  initValues?: initValuesInput;
  onCreated?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const isUpdate = mode == "update";

  function isoToDatetimeLocal(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    // YYYY-MM-DDTHH:mm
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TaskCreateFormInput | TaskUpdateFormInput>({
    defaultValues: {
      title: initValues?.title ?? "",
      status: initValues?.status ?? "TODO",
      priority: initValues?.priority ?? "MEDIUM",
      due_datetime: isoToDatetimeLocal(initValues?.due_datetime),
    } as initValuesInput,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(isUpdate ? taskUpdateSchema : taskCreateSchema),
  });

  async function onSubmit(values: any) {
    try {
      if (isUpdate) {
        const payload: TaskUpdateInput = {
          title: values.title,
          status: values.status ?? "TODO",
          priority: values.priority ?? "MEDIUM",
          due_datetime: values.due_datetime
            ? new Date(values.due_datetime).toISOString()
            : null,
        };

        await apiFetch(`${TASK_API_PATH}/${taskId}`, {
          method: "PATCH",
          json: payload,
        });

        onSave?.();
        return;
      }
      const payload: TaskCreateInput = {
        ...values,
        status: values.status ?? "TODO",
        priority: values.priority ?? "MEDIUM",
        due_datetime: values.due_datetime
          ? new Date(values.due_datetime).toISOString()
          : null,
      };

      await apiFetch(TASK_API_PATH, {
        method: "POST",
        json: payload,
      });

      reset({
        title: "",
        status: "TODO",
        priority: "MEDIUM",
        due_datetime: "",
      });
      onCreated?.();
    } catch (e) {
      if (e instanceof ApiError) {
        setError("root", { message: e.message });
      } else {
        setError("root", { message: "Something went wrong" });
      }
    }
  }

  return (
    <form
      className="w-full flex flex-row items-center mb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        {errors.root?.message && (
          <div className="flex items-start sm:items-center p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg">
            <svg
              className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0"
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
                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {errors.root.message}
          </div>
        )}
        <div className="my-4">
          <div className="relative">
            <input
              type="text"
              {...register("title")}
              className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none peer"
              placeholder=" "
            />
            <label
              htmlFor="title"
              className="absolute text-sm text-gray-500 top-3 -z-10 text-blue-600 scale-75 -translate-y-6 -translate-x-1"
            >
              Title
            </label>
          </div>
          {errors?.title && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="relative">
              <input
                className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none peer"
                type="datetime-local"
                {...register("due_datetime")}
                placeholder="Select date"
              />
              <label
                htmlFor="due_datetime"
                className="absolute text-sm text-gray-500 top-3 -z-10 text-blue-600 scale-75 -translate-y-6 -translate-x-1"
              >
                Due date
              </label>
            </div>
            {errors?.due_datetime && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.due_datetime.message}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <select
                {...register("priority")}
                className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none peer"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
              <label
                htmlFor="priority"
                className="absolute text-sm text-gray-500 top-3 -z-10 text-blue-600 scale-75 -translate-y-6 -translate-x-1"
              >
                priority
              </label>
            </div>
            {errors?.priority && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.priority.message}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <select
                {...register("status")}
                className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none peer"
              >
                <option value="TODO">TODO</option>
                <option value="DONE">DONE</option>
              </select>
              <label
                htmlFor="status"
                className="absolute text-sm text-gray-500 top-3 -z-10 text-blue-600 scale-75 -translate-y-6 -translate-x-1"
              >
                Status
              </label>
            </div>
            {errors?.status && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="flex flex-col item-center justify-center space-y-4">
        {isUpdate ? (
          <>
            <button
              onClick={() => onCancel?.()}
              disabled={isSubmitting}
              className={`flex flex-row justify-center items-center text-white rounded-full p-2 text-white rounded-full p-2 ${isSubmitting ? "bg-blue-300" : "cursor-pointer bg-gray-400 hover:bg-gray-500"}`}
            >
              <svg
                className="w-4 h-4 text-white dark:text-white"
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
                  d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
                />
              </svg>
            </button>
            <button
              disabled={isSubmitting}
              className={`flex flex-row justify-center items-center text-white rounded-full p-2 text-white rounded-full p-2 ${isSubmitting ? "bg-blue-300" : "cursor-pointer bg-blue-500 hover:bg-blue-700"}`}
            >
              <svg
                className="w-4 h-4 text-white dark:text-white"
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
            </button>
          </>
        ) : (
          <button
            disabled={isSubmitting}
            className={`ms-4 flex flex-row justify-center items-center text-white rounded-full p-2 text-white rounded-full ${isSubmitting ? "bg-blue-300" : "cursor-pointer bg-blue-500 hover:bg-blue-700"}`}
          >
            <svg
              className="w-4 h-4 text-white dark:text-white"
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
          </button>
        )}
      </div>
    </form>
  );
}
