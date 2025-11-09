"use client";

import { Task } from "@/hooks/useLocalTasks";
import { Card } from "./ui/card";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import ProgressBar from "./ProgressBar";
import { Checkbox } from "./ui/checkbox";

export default function TaskCard({
  task,
  toggleTask,
  handlePlus,
  handleMinus,
}: {
  task: Task;
  toggleTask: (id: string) => void;
  handlePlus: (id: string) => void;
  handleMinus: (id: string) => void;
}) {
  const { completed, id, name, deadline, description, progress } = task;
  const progressnum = (() => {
    if (!progress) return 0;
    return Math.round((progress.value / progress.max) * 100);
  })();

  const oneDayInMs = 24 * 60 * 60 * 1000;
  const now = new Date();
  const remainingDays = deadline
    ? Math.ceil((new Date(deadline).valueOf() - now.valueOf()) / oneDayInMs)
    : NaN;

  return (
    <>
      <Card className="w-full mb-3 p-4">
        <span className="flex items-center">
          <span className="text-2xl">
            <Checkbox
              checked={completed}
              onCheckedChange={() => toggleTask(id)}
              className="size-5.5 ml-2 mr-1.5"
            />
            <b>{name}</b>
          </span>
            <span className="flex justify-end items-center text-right ml-auto gap-2">
              <p className="text-0.75xl">
                {deadline
                  ? new Date(deadline).toLocaleDateString("sv-SE")
                  : "期限なし"}
              </p>
              <p className="whitespace-nowrap">
                残り
                <b
                  style={{
                    color:
                      remainingDays <= 0
                        ? "red"
                        : remainingDays <= 7
                        ? "orange"
                        : "black",
                  }}
                >
                  {Number.isNaN(remainingDays) ? "不明" : remainingDays}
                </b>
                日
              </p>
            </span>
        </span>

        <p className="mr-auto">{description}</p>
        <div>
          {progress && (
            <div className="flex flex-col items-center mt-2">
              <div className="flex justify-center items-center w-[80%] space-x-2">
                <CiCircleMinus
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMinus(id);
                  }}
                  size={25}
                  className="cursor-pointer"
                />
                <ProgressBar progress={progressnum} />
                <CiCirclePlus
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlus(id);
                  }}
                  size={25}
                  className="cursor-pointer"
                />
              </div>
              <p className="mt-1 text-sm">
                現在 {progress?.value}/{progress?.max} ページ
              </p>
            </div>
          )}
        </div>
        {/* <div className="h-2" /> */}
      </Card>
      <br />
    </>
  );
}
