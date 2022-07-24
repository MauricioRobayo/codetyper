import { Button, Group, List, Text } from "@mantine/core";
import { PlayIcon, ResetIcon } from "@radix-ui/react-icons";
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
                <Text weight="bolder">{filename}</Text>
              ) : (
                <>
                  <Text color="dimmed">{filename}</Text>
                  <Link
                    href={{ hash: generateFilenameSlug(filename) }}
                    passHref
                  >
                    <Button
                      component="a"
                      color="dimmed"
                      variant="light"
                      compact
                    >
                      {typingTest.isDone ? <ResetIcon /> : <PlayIcon />}
                    </Button>
                  </Link>
                </>
              )}
              {typingTest.isDone && <TestResult result={typingTest.result} />}
            </Group>
          </List.Item>
        );
      })}
    </List>
  );
}
