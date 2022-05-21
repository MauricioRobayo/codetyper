import { useEffect, useState } from "react";
import cn from "classnames";

type TypeTest = {
  text: string;
};

type CharacterStatus = "success" | "error" | "active" | "idle";
type TextState = {
  char: string;
  status: CharacterStatus;
  typedKey: string;
}[];

const characterColorMap: Record<CharacterStatus, string> = {
  error: "text-red-400 text-bold",
  idle: "bg-none",
  success: "text-green-400",
  active: "bg-green-400",
};

export function TypeTest({ text }: TypeTest) {
  const [textState, setTextState] = useState<TextState>(() =>
    text.split("").map((char) => ({ char, status: "idle", typedKey: "" }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeydown = ({ key }: KeyboardEvent) => {
      console.log({ key });

      if (key === "Control") {
        return;
      }

      if (key === "Backspace") {
        setCurrentIndex((previousCurrentIndex) =>
          Math.max(0, previousCurrentIndex - 1)
        );

        setTextState((previousTextState) => {
          const newTextState = [...previousTextState];
          newTextState[currentIndex - 1].status = "idle";
          newTextState[currentIndex - 1].typedKey = "";
          return newTextState;
        });

        return;
      }

      if (key !== "Shift" && key !== textState[currentIndex].char) {
        setTextState((previousTextState) => {
          const newTextState = [...previousTextState];
          newTextState[currentIndex].status = "error";
          newTextState[currentIndex].typedKey = key;
          return newTextState;
        });
      }

      if (key === textState[currentIndex].char) {
        setTextState((previousTextState) => {
          const newTextState = [...previousTextState];
          newTextState[currentIndex].status = "success";
          newTextState[currentIndex].typedKey = key;
          return newTextState;
        });
      }

      setCurrentIndex((previousIndex) => {
        if (key === "Shift") {
          return previousIndex;
        }

        return Math.min(textState.length, previousIndex + 1);
      });
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentIndex, textState]);

  return (
    <div className="bg-slate-800 text-green-600 rounded-sm my-4 p-4">
      <pre>
        {textState.map(({ char, status }, index) => {
          return (
            <span
              className={cn("pt-1", characterColorMap[status], {
                [characterColorMap["active"]]: index === currentIndex,
              })}
              key={index}
            >
              {textState[index].typedKey || textState[index].char}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
