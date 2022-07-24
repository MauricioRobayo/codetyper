import { Badge } from "@mantine/core";
import { TypingTestResult } from "../TypeTest/useTypingTest";

interface TypingTestResultProps {
  result: TypingTestResult;
}
export function TestResult({
  result: { netWPM, accuracy },
}: TypingTestResultProps) {
  return (
    <>
      <Badge color="teal" variant="light">
        wpm {netWPM}
      </Badge>
      <Badge color="teal" variant="light">
        acc {Math.round(accuracy * 100)}%
      </Badge>
    </>
  );
}
