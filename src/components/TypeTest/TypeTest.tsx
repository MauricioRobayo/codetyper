import { useEffect, useState } from "react";
import { start } from "repl";
import Character from "./Character";

type CharacterStatus = "success" | "error" | "corrected" | null;
type TextState = {
  char: string;
  displayChar: string;
  status: CharacterStatus;
  typedKey: string;
  ignore: boolean;
  isActive: boolean;
}[];

const displayChars: Record<string, string> = {
  "\n": "⏎",
};

type TypingTestResult = {
  errors: number;
  netWPM: number;
  grossWPM: number;
  accuracy: number;
};
type TypingTestProps = {
  text: string;
  onFinish: (results: TypingTestResult) => void;
  classes?: Record<
    NonNullable<CharacterStatus> | "background" | "active",
    string
  >;
};
export function TypingTest({ text, onFinish, classes }: TypingTestProps) {
  const [textState, setTextState] = useState<TextState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setTextState(textToObject(text));
  }, [text]);

  useEffect(() => {
    if (textState === null) {
      return;
    }

    const handleKeydown = (e: KeyboardEvent) => {
      const { key, ctrlKey, altKey } = e;
      if (
        altKey ||
        ctrlKey ||
        [
          "Alt",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "CapsLock",
          "Control",
          "Delete",
          "End",
          "Escape",
          "Home",
          "MediaPause",
          "PageDown",
          "PageUp",
          "Shift",
          "Tab",
        ].includes(key)
      ) {
        return;
      }

      e.preventDefault();

      if (!isTyping) {
        setIsTyping(true);
        setStartTime(Date.now());
      }

      if (key === "Backspace") {
        if (currentIndex === 0) {
          return;
        }

        let newIndex = Math.max(0, currentIndex - 1);
        while (textState[newIndex]?.ignore) {
          newIndex--;
        }

        setCurrentIndex(newIndex);
        updateState({ textState, typedKey: "", index: newIndex });
        return;
      }

      const currentCharState = textState[currentIndex];

      let newCharStatus: CharacterStatus = null;
      if (
        (key === "Enter" && currentCharState?.char === "\n") ||
        key === currentCharState?.char
      ) {
        newCharStatus = "success";
      } else {
        newCharStatus = "error";
      }

      if (
        newCharStatus === "success" &&
        (currentCharState?.status === "error" ||
          currentCharState?.status === "corrected")
      ) {
        newCharStatus = "corrected";
      }

      updateState({ textState, status: newCharStatus, typedKey: key });

      function updateState({
        textState,
        status,
        typedKey,
        index,
      }: {
        textState: TextState;
        status?: NonNullable<CharacterStatus>;
        typedKey: string;
        index?: number;
      }) {
        const newIndex = index ?? calculateNewIndex(textState, currentIndex);
        const newCharState = textState[newIndex];
        const currentCharState = textState[currentIndex];

        if (newCharState && currentCharState) {
          newCharState.isActive = true;
          newCharState.typedKey = "";
          currentCharState.isActive = false;
          currentCharState.status = status ?? currentCharState.status;
          currentCharState.typedKey = typedKey === "Enter" ? " " : typedKey;
        }
        setTextState([...textState]);
        setCurrentIndex(newIndex);
        if (currentIndex === textState.length - 1 && typedKey === "Enter") {
          if (!startTime) {
            throw Error("This should not happen, no start time!");
          }
          setIsTyping(false);
          const endTime = Date.now();
          const results = calculateResults(textState, startTime, endTime);
          onFinish(results);
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentIndex, textState, onFinish, isTyping, startTime]);

  if (textState === null) {
    return null;
  }

  return (
    <pre className={classes ? classes.background : ""}>
      {textState.map(
        ({ char, status, typedKey, displayChar, isActive }, index) => {
          const displayedEndOfLine: string = isActive
            ? `${displayChar}\n`
            : {
                error: `${typedKey}\n`,
                idle: `\n`,
                success: `\n`,
                corrected: "\n",
              }[status ?? "idle"];
          return (
            <Character
              key={index}
              className={
                classes && index <= currentIndex
                  ? isActive
                    ? classes["active"]
                    : status
                    ? classes[status]
                    : ""
                  : ""
              }
              textChar={char}
              typedKey={char === "\n" ? displayedEndOfLine : typedKey}
            />
          );
        }
      )}
    </pre>
  );
}

function textToObject(text: string): TextState {
  const textWithEndMarker = text.endsWith("\n") ? text : `${text}\n`;
  let ignore = false;
  let setIgnore = false;
  const textState: TextState = textWithEndMarker
    .replace(/[“”]/g, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[—–]/g, "-")
    .replace(/’/g, "'")
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
        status: null,
        typedKey: "",
        ignore,
        isActive: index === 0,
      };
    });
  return textState;
}

function calculateNewIndex(textState: TextState, currentIndex: number) {
  let newIndex = Math.min(textState.length - 1, currentIndex + 1);
  while (textState[newIndex]?.ignore) {
    newIndex++;
  }
  return newIndex;
}

function calculateResults(
  textState: TextState,
  startTime: number,
  endTime: number
): TypingTestResult {
  throw new Error("Function not implemented.");
}
