import { Text } from "@mantine/core";
import { TypingTestResult } from "../TypeTest/useTypingTest";

interface TypingTestResultProps {
  result: TypingTestResult;
}
export function TestResult({
  result: { netWPM, accuracy },
}: TypingTestResultProps) {
  return (
    <>
      <Text weight="bold">wpm {netWPM}</Text>
      <Text weight="bold">acc {Math.round(accuracy * 100)}</Text>
    </>
  );
}
