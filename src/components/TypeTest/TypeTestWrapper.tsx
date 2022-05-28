import { TypeTest } from "./TypeTest";

type TypeTestWrapperProps = {
  text: string;
  onFinish: () => void;
};
export const TypeTestWrapper = ({ text, onFinish }: TypeTestWrapperProps) => {
  return (
    <div className="font-mono bg-slate-800 text-green-600 rounded-sm m-4 p-4 text-lg">
      <pre className="whitespace-pre-wrap">
        <TypeTest text={text} onFinish={onFinish} />
      </pre>
    </div>
  );
};
