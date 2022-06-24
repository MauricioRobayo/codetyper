import { Group, Text, useMantineTheme } from "@mantine/core";
import { GistFileWithResult } from "../../pages/gist/[username]/[id]";
import { FileIcon } from "./FileIcon";
import { TestResult } from "./TestResult";

export type FileStatus = "pending" | "active" | "done";

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
        const fileStatus = getFileStatus(index, activeGistIndex);
        const isActive = fileStatus === "active";
        const isPending = fileStatus === "pending";
        return (
          <Group key={raw_url} spacing="xs">
            <Text
              color={isPending ? "dimmed" : "lime"}
              weight={isActive ? "bold" : "normal"}
            >
              <FileIcon status={getFileStatus(index, activeGistIndex)} />
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

function getFileStatus(index: number, activeIndex: number): FileStatus {
  if (index < activeIndex) {
    return "done";
  }

  if (index === activeIndex) {
    return "active";
  }

  return "pending";
}
