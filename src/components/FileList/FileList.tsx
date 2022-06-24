import { Group, Text } from "@mantine/core";
import { GistFileWithResult } from "../../pages/gist/[username]/[id]";
import { FileIcon } from "./FileIcon";
import { TestResult } from "./TestResult";

interface FilesListProps {
  gistFiles: GistFileWithResult[];
  activeGistFile?: GistFileWithResult;
}
export function FileList({ gistFiles, activeGistFile }: FilesListProps) {
  return (
    <Group direction="column" spacing={0}>
      {gistFiles?.map(({ filename, raw_url, typingTest }) => {
        const isActive = filename === activeGistFile?.filename;
        const isPending = !typingTest.isDone && !isActive;
        return (
          <Group key={raw_url} spacing="xs">
            <Text
              color={isPending ? "dimmed" : "lime"}
              weight={isActive ? "bold" : "normal"}
            >
              <FileIcon isDone={typingTest.isDone} isActive={isActive} />
            </Text>
            <Text
              color={isPending ? "dimmed" : "lime"}
              weight={isActive ? "bold" : "normal"}
            >
              {filename}
            </Text>
            {typingTest.isDone && <TestResult result={typingTest.result} />}
          </Group>
        );
      })}
    </Group>
  );
}
