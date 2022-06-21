import Character from "./Character";
import {
  CharacterStatus,
  TypingTestResult,
  useTypingTest,
} from "./useTypingTest";

type TypingTestProps = {
  text: string;
  onFinish: (results: TypingTestResult) => void;
  classes?: Record<
    NonNullable<CharacterStatus> | "background" | "active",
    string
  >;
};
export function TypingTest({ text, onFinish, classes }: TypingTestProps) {
  const { textState, currentIndex } = useTypingTest(text, onFinish);

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
        }
      )}
    </pre>
  );
}
