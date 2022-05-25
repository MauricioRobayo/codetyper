import cn from "classnames";
import { useEffect, useState } from "react";

type TypeTest = {
  text: string;
};

type CharacterStatus = "success" | "error" | "active" | "idle";
type TextState = {
  char: string;
  status: CharacterStatus;
  typedKey: string;
  ignore: boolean;
}[];

const characterColorMap: Record<CharacterStatus, string> = {
  error: "text-red-400 font-bold",
  idle: "",
  success: "text-green-300",
  active: "bg-green-300",
};

export function TypeTest({ text }: TypeTest) {
  const [textState, setTextState] = useState<TextState>(() => {
    let ignore = false;
    let setIgnore = false;
    return text.split("").map((char, index) => {
      if (!setIgnore && char === "\n") {
        ignore = false;
        setIgnore = true;
      } else if (setIgnore && /\s/.test(char)) {
        ignore = true;
      } else {
        ignore = false;
        setIgnore = false;
      }
      return {
        char,
        status: index === 0 ? "active" : "idle",
        typedKey: "",
        ignore,
      };
    });
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeydown = ({ key, ctrlKey, altKey }: KeyboardEvent) => {
      if (
        altKey ||
        ctrlKey ||
        [
          "Alt",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "Control",
          "Delete",
          "End",
          "Escape",
          "Home",
          "MediaPause",
          "PageDown",
          "PageUp",
          "Shift",
        ].includes(key)
      ) {
        return;
      }

      if (key === "Backspace") {
        if (currentIndex === 0) {
          return;
        }

        let newIndex = Math.max(0, currentIndex - 1);
        while (textState[newIndex].ignore) {
          newIndex--;
        }

        setCurrentIndex(newIndex);
        updateState("idle", "", newIndex);
        return;
      }

      if (
        (key === "Enter" && textState[currentIndex].char === "\n") ||
        key === textState[currentIndex].char
      ) {
        updateState("success", textState[currentIndex].char);
        return;
      }

      updateState("error", [" ", "Enter"].includes(key) ? "_" : key);

      function calculateNewIndex() {
        let newIndex = Math.min(textState.length, currentIndex + 1);
        while (textState[newIndex].ignore) {
          newIndex++;
        }
        return newIndex;
      }

      function updateState(
        status: CharacterStatus,
        typedKey: string,
        index?: number
      ) {
        const newIndex = index ?? calculateNewIndex();
        setTextState((previousTextState) => {
          previousTextState[newIndex].status = "active";
          previousTextState[currentIndex].status = status;
          previousTextState[currentIndex].typedKey = typedKey;
          return [...previousTextState];
        });
        setCurrentIndex(newIndex);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentIndex, textState]);

  return (
    <>
      <div className="bg-slate-800 text-green-600 rounded-sm m-4 p-4 text-lg">
        <pre>
          {textState.map(({ char, status, typedKey }, index) => {
            return (
              <span
                className={cn(
                  "pt-1 before:content-[attr(data-content)]",
                  characterColorMap[status]
                )}
                key={index}
                data-content={
                  index === currentIndex && char === "\n"
                    ? "⏎"
                    : status === "error" && char === "\n"
                    ? typedKey
                    : ""
                }
              >
                {char === "\n" ? "\n" : typedKey || char}
              </span>
            );
          })}
        </pre>
      </div>
    </>
  );
}
