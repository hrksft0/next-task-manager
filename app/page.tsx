// import Image from "next/image";
import TaskList from "@/components/TaskList";
import AddTask from "@/components/AddTask";

export default function Home() {
  return (
    <div className="text-center">
      <h2 className="text-2xl">タスク追加</h2>
      <AddTask />
      <h2 className="text-2xl">タスク一覧</h2>
      <TaskList />
    </div>
  );
}
