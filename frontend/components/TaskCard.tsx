import { Task } from "@/lib/types";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <>
      <div>
        <input
          type="checkbox"
          // checked={task.is_completed}
          // disabled={task.is_completed}
          name="isCompleted"
          //onChange={() => onComplete(task.id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="isCompleted"
          className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        ></label>
      </div>
      <div className="w-full mx-6">
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <p>{task.status}</p>
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600">
          <span className="">{task.due_datetime?.split("T")[0]}</span>
          <span
            className={`self-start md:self-auto px-2 py-1 text-xs font-medium rounded-lg ${
              task.priority === "HIGH"
                ? "bg-red-100 text-red-800"
                : task.priority === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </>
  );
}
