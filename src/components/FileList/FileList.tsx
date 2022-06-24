import { Group, Text } from "@mantine/core";
import { GistFileWithResult } from "../../pages/gist/[username]/[id]";
import { FileIcon } from "./FileIcon";
import { TestResult } from "./TestResult";

interface FilesListProps {
  gistFiles: GistFileWithResult[];
  activeGistIndex: number;
}
export function FileList({ gistFiles, activeGistIndex }: FilesListProps) {
  if (gistFiles.length === 1) {
    const gistFile = gistFiles[0]!;
    return (
      <Group spacing="xs">
        <Text>{gistFile.filename}</Text>
        {gistFile.typingTestResult && (
          <TestResult result={gistFile.typingTestResult} />
        )}
      </Group>
    );
  }

  return (
    <Group direction="column" spacing={0}>
      {gistFiles?.map(({ filename, raw_url, typingTestResult }, index) => {
        const isDone = !!typingTestResult;
        const isActive = index === activeGistIndex;
        const isPending = !isDone && !isActive;
        return (
          <Group key={raw_url} spacing="xs">
            <Text
              color={isPending ? "dimmed" : "lime"}
              weight={isActive ? "bold" : "normal"}
            >
              <FileIcon isDone={isDone} isActive={isActive} />
            </Text>
            <Text
              color={isPending ? "dimmed" : "lime"}
              weight={isActive ? "bold" : "normal"}
            >
              {filename}
            </Text>
            {typingTestResult && <TestResult result={typingTestResult} />}
          </Group>
        );
      })}
    </Group>
  );
}
