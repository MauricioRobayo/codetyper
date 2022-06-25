import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Title,
  Text,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { generateFilenameSlug } from ".";
import { GIST_BASE_PATH } from "../../../../config";
import { FileList } from "../../../components/FileList";
import { TypeTest } from "../../../components/TypeTest";
import {
  TextState,
  TypingTestResult,
} from "../../../components/TypeTest/useTypingTest";
import { GistFile, useGistQuery } from "../../../hooks/useGistQuery";
import { useRawFilesQuery } from "../../../hooks/useRawFilesQuery";

export type GistFileWithResult = GistFile & {
  typingTest:
    | {
        isDone: false;
      }
    | {
        isDone: true;
        result: TypingTestResult;
        textState: TextState;
      };
};

const GistPage: NextPage = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const username = router.query.username as string | undefined;
  const [gistFilesWithResult, setGistFilesWithResults] = useState<
    GistFileWithResult[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const gistQuery = useGistQuery(id ?? "", {
    onSuccess: (gist) => {
      setGistFilesWithResults(
        Object.values(gist.files).map(
          (file): GistFileWithResult => ({
            ...file,
            typingTest: {
              isDone: false,
            },
          })
        )
      );
    },
  });
  const rawFilesQuery = useRawFilesQuery(
    gistFilesWithResult?.map(({ raw_url }) => raw_url) ?? []
  );
  const currentGistFile = useMemo(() => {
    const currentGistSlug = router.asPath.split("#")[1];
    return gistFilesWithResult.find(
      (gistFile) => generateFilenameSlug(gistFile.filename) === currentGistSlug
    );
  }, [router.asPath, gistFilesWithResult]);
  const onFinish = useCallback(
    (textState: TextState, result: TypingTestResult) => {
      if (currentGistFile) {
        currentGistFile.typingTest = {
          isDone: true,
          result,
          textState,
        };
        setGistFilesWithResults([...gistFilesWithResult]);
      }
      flushSync(() => {
        setIsTyping(false);
      });
      buttonRef.current?.focus();
    },
    [currentGistFile, gistFilesWithResult]
  );
  const onStart = useCallback(() => {
    setIsTyping(true);
  }, []);

  useEffect(() => {
    const hash = router.asPath.split("#")[1];
    if (!hash && gistQuery.data) {
      const hash = generateFilenameSlug(
        Object.values(gistQuery.data.files)[0]!.filename
      );
      router.replace({ hash });
    }
  }, [gistQuery.data, router]);

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  if (gistQuery.isSuccess && !currentGistFile) {
    return <div>This is unexpected!</div>;
  }

  if (rawFilesQuery.isSuccess && currentGistFile) {
    const currentRawFileData = rawFilesQuery.data.find(
      (rawFileData) => rawFileData.url === currentGistFile.raw_url
    );
    if (!currentRawFileData) {
      return <div>This is unexpected, no text found!</div>;
    }
    return (
      <Container>
        {gistQuery.data && (
          <Group mb="md" position="apart">
            <Title
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "95%",
              }}
            >
              <Text>{gistQuery.data.description || gistQuery.data.id}</Text>
            </Title>
            <Anchor
              href={`https://gist.github.com${router.asPath.replace(
                GIST_BASE_PATH,
                ""
              )}`}
              variant="text"
              title="View on GitHub"
            >
              <GitHubLogoIcon />
            </Anchor>
          </Group>
        )}
        {gistFilesWithResult && (
          <FileList
            gistFiles={gistFilesWithResult}
            activeGistFile={currentGistFile}
          />
        )}
        <TypeTest
          text={currentRawFileData.text}
          previousTextState={
            currentGistFile.typingTest.isDone
              ? currentGistFile.typingTest.textState
              : undefined
          }
          onFinish={onFinish}
          onStart={onStart}
        />

        <Group position="apart">
          <Link href={`${GIST_BASE_PATH}/${username}`} passHref>
            <Anchor>
              <ArrowLeftIcon /> {username}&apos;s gists
            </Anchor>
          </Link>
          {gistFilesWithResult.length > 1 && !isTyping && (
            <Link
              href={`#${generateNextFileLink(
                gistFilesWithResult,
                currentGistFile
              )}`}
              passHref
            >
              <Button
                component="a"
                ref={buttonRef}
                rightIcon={<ArrowRightIcon />}
              >
                Next File
              </Button>
            </Link>
          )}
        </Group>
      </Container>
    );
  }

  return (
    <Center>
      <Loader />
    </Center>
  );
};

export default GistPage;

function generateNextFileLink(
  gistFilesWithResult: GistFileWithResult[],
  currentGistFile: GistFile
) {
  const currentIndex = gistFilesWithResult.findIndex(
    (gistFile) => gistFile.filename === currentGistFile?.filename
  );
  const nextIndex = (currentIndex + 1) % gistFilesWithResult.length;
  const nextFile = gistFilesWithResult[nextIndex]!;
  return generateFilenameSlug(nextFile.filename);
}
