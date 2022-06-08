import { useEffect, useState } from "react";
import Character from "./Character";

type CharacterStatus = "success" | "error" | "active" | "idle";
type TextState = {
  char: string;
  displayChar: string;
  status: CharacterStatus;
  typedKey: string;
  ignore: boolean;
}[];

const displayChars: Record<string, string> = {
  "\n": "⏎",
};

type TypeTestProps = {
  text: string;
  onFinish: () => void;
  classes?: Record<CharacterStatus | "background", string>;
};
export function TypeTest({ text, onFinish, classes }: TypeTestProps) {
  const [textState, setTextState] = useState<TextState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

      if (key === "Backspace") {
        if (currentIndex === 0) {
          return;
        }

        let newIndex = Math.max(0, currentIndex - 1);
        while (textState[newIndex]?.ignore) {
          newIndex--;
        }

        setCurrentIndex(newIndex);
        updateState(textState, "idle", "", newIndex);
        return;
      }

      const currentCharState = textState[currentIndex];

      const success =
        (key === "Enter" && currentCharState?.char === "\n") ||
        key === currentCharState?.char;

      updateState(textState, success ? "success" : "error", key);

      function calculateNewIndex(textState: TextState) {
        let newIndex = Math.min(textState.length - 1, currentIndex + 1);
        while (textState[newIndex]?.ignore) {
          newIndex++;
        }
        return newIndex;
      }

      function updateState(
        textState: TextState,
        status: CharacterStatus,
        typedKey: string,
        index?: number
      ) {
        const newIndex = index ?? calculateNewIndex(textState);
        const newCharState = textState[newIndex];
        const currentCharState = textState[currentIndex];

        if (newCharState && currentCharState) {
          newCharState.status = "active";
          newCharState.typedKey = "";
          currentCharState.status = status;
          currentCharState.typedKey = typedKey === "Enter" ? " " : typedKey;
        }
        setTextState([...textState]);
        setCurrentIndex(newIndex);
        if (currentIndex === textState.length - 1 && typedKey === "Enter") {
          onFinish();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentIndex, textState, onFinish]);

  if (textState === null) {
    return null;
  }

  return (
    <pre className={classes ? classes.background : ""}>
      {textState.map(({ char, status, typedKey, displayChar }, index) => {
        const displayedEndOfLine: string = {
          active: `${displayChar}\n`,
          error: `${typedKey}\n`,
          idle: `\n`,
          success: `\n`,
        }[status];
        return (
          <Character
            key={index}
            className={classes ? classes[status] : ""}
            textChar={char}
            typedKey={char === "\n" ? displayedEndOfLine : typedKey}
          />
        );
      })}
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
        status: index === 0 ? "active" : "idle",
        typedKey: "",
        ignore,
      };
    });
  return textState;
}
