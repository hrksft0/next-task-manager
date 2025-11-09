"use client";

import { useLocalTasks } from "@/hooks/useLocalTasks";
import React, { useContext, useState } from "react";
import type { Task } from "@/hooks/useLocalTasks";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function AddTask({ parentId }: { parentId?: string }) {
  const [newTask, setNewTask] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newDeadLine, setNewDeadLine] = useState<Date>(new Date());
  const [newMax, setNewMax] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const { addTask, tasks, addSubtask } = useLocalTasks();

  const ALLOWED = [
    "-",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Backspace",
  ];

  const createNewTask = (): Task => ({
    id: uuidv4(),
    name: newTask,
    description: newDesc,
    deadline: newDeadLine.toLocaleDateString(),
    subtasks: [],
    completed: false,
    progress: {
      max: newMax,
      value: 0,
    },
  });

  const handleClick = async () => {
    if (!newTask.trim()) return;

    const taskToAdd = createNewTask();

    try {
      addTask(taskToAdd);
      // 成功時のみフォームをリセット
      setNewTask("");
      setNewDesc("");
      setNewDeadLine(new Date());
      setNewMax(1);
    } catch (error) {
      // エラー処理（例：トースト通知など）
      console.error("タスクの追加に失敗しました:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center m-auto sm:w-full md:w-[80vw] lg:w-[40vw]">
      <Card>
        <div className="w-[95%] mx-auto flex flex-col gap-3 items-center justify-center">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="タスクを入力"
          />
          <Textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="説明を入力"
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {newDeadLine ? newDeadLine.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={newDeadLine}
                onSelect={(date) => date && setNewDeadLine(date)}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="number"
            value={newMax === 0 ? "" : newMax}
            onChange={(event) => {
              const newValue = parseInt(event.target.value);
              if (isNaN(newValue)) {
                event.preventDefault();
                return;
              }
              setNewMax(newValue);
            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key.match(/\d/)) return;
              if (ALLOWED.includes(event.key)) return;
              event.preventDefault();
            }}
            placeholder="全体ページ数※0の場合進捗機能は使えません"
          />
        </div>
      </Card>
      <Button onClick={handleClick} className="mt-2">
        {parentId ? "サブタスクを追加" : "タスクを作成"}
      </Button>
    </div>
  );
}
