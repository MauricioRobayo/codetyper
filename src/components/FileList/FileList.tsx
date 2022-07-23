import { Anchor, Group, List, Text } from "@mantine/core";
import Link from "next/link";
import { GistFileWithResult } from "../../pages/gist/[username]/[id]";
import { generateFilenameSlug } from "../../utils/generateFilenameSlug";
import { FileIcon } from "./FileIcons";
import { TestResult } from "./TestResult";

interface FilesListProps {
  gistFiles: GistFileWithResult[];
  activeGistFile?: GistFileWithResult;
}
export function FileList({ gistFiles, activeGistFile }: FilesListProps) {
  return (
    <List spacing="xs" size="sm">
      {gistFiles?.map(({ filename, raw_url, typingTest }) => {
        const isActive = filename === activeGistFile?.filename;
        return (
          <List.Item
            key={raw_url}
            icon={<FileIcon isActive={isActive} isDone={typingTest.isDone} />}
          >
            <Group>
              {isActive ? (
                <Text>{filename}</Text>
              ) : (
                <Link href={{ hash: generateFilenameSlug(filename) }} passHref>
                  <Anchor>{filename}</Anchor>
                </Link>
              )}
              {typingTest.isDone && <TestResult result={typingTest.result} />}
            </Group>
          </List.Item>
        );
      })}
    </List>
  );
}
