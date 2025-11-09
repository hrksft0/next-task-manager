"use client";
import { useLocalTasks } from "@/hooks/useLocalTasks";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const { tasks, toggleTask, handlePlus, handleMinus } = useLocalTasks();

  return (
    <div className="flex flex-wrap justify-center m-auto sm:w-full md:w-[80vw] lg:w-[40vw]">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          handlePlus={handlePlus}
          handleMinus={handleMinus}
        />
      ))}
    </div>
  );
}
