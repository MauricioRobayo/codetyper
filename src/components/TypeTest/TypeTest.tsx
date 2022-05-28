import cn from "classnames";
import { useEffect, useState } from "react";

type CharacterStatus = "success" | "error" | "active" | "idle";
type TextState = {
  char: string;
  displayChar: string;
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

const displayChars: Record<string, string> = {
  "\n": "⏎",
};

type TypeTestProps = {
  text: string;
};
export function TypeTest({ text }: TypeTestProps) {
  const [textState, setTextState] = useState<TextState>(() => {
    let ignore = false;
    let setIgnore = false;
    const textState: TextState = text
      .replace(/[“”]/g, '"')
      .split("")
      .map((char, index) => {
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
          displayChar: displayChars[char] ?? char,
          status: index === 0 ? "active" : "idle",
          typedKey: "",
          ignore,
        };
      });
    return textState;
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
          "CapsLock",
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
        let newIndex = Math.min(textState.length - 1, currentIndex + 1);
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
          previousTextState[newIndex].typedKey = "";
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
      {textState.map(({ char, status, typedKey, displayChar }, index) => {
        return (
          <span
            className={cn(
              "pt-1 before:content-[attr(data-content)]",
              characterColorMap[status]
            )}
            key={index}
            data-content={
              status === "active" && char === "\n"
                ? displayChar
                : status === "error" && char === "\n"
                ? typedKey
                : ""
            }
          >
            {char === "\n" ? "\n" : typedKey || char}
          </span>
        );
      })}
    </>
  );
}
