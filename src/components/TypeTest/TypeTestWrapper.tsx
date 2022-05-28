import { TypeTest } from "./TypeTest";

type TypeTestWrapperProps = {
  text: string;
};
export const TypeTestWrapper = ({ text }: TypeTestWrapperProps) => {
  return (
    <div className="font-mono bg-slate-800 text-green-600 rounded-sm m-4 p-4 text-lg">
      <pre className="whitespace-pre-wrap">
        <TypeTest text={text} />
      </pre>
    </div>
  );
};