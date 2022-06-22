import { useEffect, useState } from "react";

export type CharacterStatus = "correct" | "error" | "corrected" | null;
export type TextState = {
  char: string;
  displayChar: string;
  status: CharacterStatus;
  typedKey: string;
  ignore: boolean;
  isActive: boolean;
  line: number;
}[];
export type TypingTestResult = {
  errors: number;
  corrects: number;
  corrected: number;
  netWPM: number;
  grossWPM: number;
  accuracy: number;
  minutes: number;
  seconds: number;
};

const displayChars: Record<string, string> = {
  "\n": "⏎",
};

export const useTypingTest = (
  text: string,
  onFinish: (result: TypingTestResult) => void
) => {
  const [textState, setTextState] = useState<TextState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setHasFinished(false);
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
        newCharStatus = "correct";
      } else {
        newCharStatus = "error";
      }

      if (
        newCharStatus === "correct" &&
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
          setCurrentLine(newCharState.line);
        }
        setTextState([...textState]);
        setCurrentIndex(newIndex);
        if (currentIndex === textState.length - 1 && typedKey === "Enter") {
          if (!startTime) {
            throw Error("This should not happen, no start time!");
          }
          setHasFinished(true);
          setIsTyping(false);
          const endTime = Date.now();
          const results = calculateResults(textState, startTime, endTime);
          onFinish(results);
        }
      }
    };

    if (!hasFinished) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentIndex, textState, isTyping, startTime, hasFinished, onFinish]);

  return { textState, currentIndex, currentLine };
};

function textToObject(text: string): TextState {
  const textWithEndMarker = text.endsWith("\n") ? text : `${text}\n`;
  let ignore = false;
  let setIgnore = false;
  let line = 0;
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
        line: char === "\n" ? line++ : line,
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
  startTimeMs: number,
  endTimeMs: number
): TypingTestResult {
  const durationInSeconds = (endTimeMs - startTimeMs) / 1000;
  const minutes = durationInSeconds / 60;
  const seconds = durationInSeconds % 60;
  const errors = textState.filter(({ status }) => status === "error").length;
  const corrected = textState.filter(
    ({ status }) => status === "corrected"
  ).length;
  const corrects = textState.filter(
    ({ status }) => status === "correct"
  ).length;
  const grossWPM = Math.round(textState.length / 5 / minutes);
  const netWPM = Math.round(grossWPM - errors / minutes);
  const accuracy = Math.round((corrects / textState.length) * 100);
  return {
    errors,
    corrects,
    corrected,
    grossWPM,
    netWPM,
    accuracy,
    minutes: Math.floor(minutes),
    seconds: Math.floor(seconds),
  };
}
