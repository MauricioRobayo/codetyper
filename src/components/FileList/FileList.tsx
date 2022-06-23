import { Group, Text } from "@mantine/core";
import { GistFile } from "../../hooks/useGistQuery";
import { FileIcon } from "./FileIcon";

export type FileStatus = "pending" | "active" | "done";

interface FilesListProps {
  gistFiles: GistFile[];
  activeGistFilename: string;
  activeGistIndex: number;
}
export function FileList({
  gistFiles,
  activeGistFilename,
  activeGistIndex,
}: FilesListProps) {
  if (gistFiles.length === 1) {
    return <Text>{activeGistFilename}</Text>;
  }

  return (
    <Group direction="column" spacing={0}>
      {gistFiles?.map(({ filename, raw_url }, index) => {
        const fileStatus = getFileStatus(index, activeGistIndex);
        const isActive = fileStatus === "active";
        return (
          <Text
            key={raw_url}
            color={isActive ? "" : "dimmed"}
            size={isActive ? "md" : "sm"}
            weight={isActive ? "bold" : "normal"}
          >
            <Group spacing="xs">
              <FileIcon status={getFileStatus(index, activeGistIndex)} />
              {filename}
            </Group>
          </Text>
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
