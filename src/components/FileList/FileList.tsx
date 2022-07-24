import { Button, Group, List, Text } from "@mantine/core";
import { EyeOpenIcon, PlayIcon } from "@radix-ui/react-icons";
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
                <Text color="dimmed">{filename}</Text>
              )}
              {typingTest.isDone && <TestResult result={typingTest.result} />}
              {!isActive && (
                <Link href={{ hash: generateFilenameSlug(filename) }} passHref>
                  <Button
                    component="a"
                    color="dimmed"
                    variant="light"
                    compact
                    px="md"
                  >
                    {typingTest.isDone ? <EyeOpenIcon /> : <PlayIcon />}
                  </Button>
                </Link>
              )}
            </Group>
          </List.Item>
        );
      })}
    </List>
  );
}
