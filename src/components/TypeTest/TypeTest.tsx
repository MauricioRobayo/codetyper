import { Text } from "@mantine/core";
import Character from "./Character";
import {
  CharacterStatus,
  TextState,
  TypingTestResult,
  useTypingTest,
} from "./useTypingTest";

const SCROLL_LINE = 4;
const VISIBLE_LINES = SCROLL_LINE * 2;
export interface TypingTestProps {
  text: string;
  previousTextState?: TextState;
  onFinish: (textState: TextState, results: TypingTestResult) => void;
  onStart: () => void;
  classes?: Record<
    NonNullable<CharacterStatus> | "textArea" | "lineCounter" | "active",
    string
  >;
}
export function TypingTest({
  text,
  previousTextState,
  onFinish,
  onStart,
  classes,
}: TypingTestProps) {
  const { textState, currentIndex, currentLine } = useTypingTest(
    text,
    onFinish,
    onStart,
    previousTextState
  );

  const lineOffset = currentLine ? Math.max(0, currentLine - SCROLL_LINE) : 0;
  const lastVisibleLine = text.split("\n").length - VISIBLE_LINES;
  const totalNumberOfLines = textState?.[textState.length - 1]?.line ?? 0;

  if (!textState) {
    return null;
  }

  return (
    <>
      <pre className={classes?.textArea ?? ""}>
        {(previousTextState ?? textState)
          .filter(
            ({ line }) =>
              line >= Math.min(lineOffset, lastVisibleLine) &&
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
      {totalNumberOfLines > VISIBLE_LINES && (
        <Text className={classes?.lineCounter ?? ""}>
          Line {currentLine + 1} of {totalNumberOfLines + 1}
        </Text>
      )}
    </>
  );
}
