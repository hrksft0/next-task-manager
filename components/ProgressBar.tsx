export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-3.5 rounded-md overflow-hidden grow flex-1">
      <div className="h-full text-white text-[0.63rem] text-center leading-3 grow bg-green-400" style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};