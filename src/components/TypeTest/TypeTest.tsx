import { useMemo } from "react";
import Character from "./Character";
import {
  CharacterStatus,
  TypingTestResult,
  useTypingTest,
} from "./useTypingTest";

const SCROLL_LINE = 4;
const VISIBLE_LINES = SCROLL_LINE * 2;
type TypingTestProps = {
  text: string;
  onFinish: (results: TypingTestResult) => void;
  classes?: Record<
    NonNullable<CharacterStatus> | "textArea" | "active",
    string
  >;
};
export function TypingTest({ text, onFinish, classes }: TypingTestProps) {
  const { textState, currentIndex, currentLine } = useTypingTest(
    text,
    onFinish
  );

  const lineOffset = currentLine
    ? Math.max(0, currentLine - SCROLL_LINE + 1)
    : 0;

  if (!textState) {
    return null;
  }

  return (
    <pre className={classes?.textArea ?? ""}>
      {textState
        .filter(
          ({ line }) =>
            line >= lineOffset &&
            line < SCROLL_LINE + lineOffset + VISIBLE_LINES / 2
        )
        .map(({ char, status, typedKey, displayChar, isActive }, index) => {
          const displayedEndOfLine: string = isActive
            ? `${displayChar}\n`
            : {
                error: `${typedKey}\n`,
                idle: `\n`,
                correct: `\n`,
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
        })}
    </pre>
  );
}
