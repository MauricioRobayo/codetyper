import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GitHubLogoIcon,
  ResetIcon,
  ShuffleIcon,
} from "@radix-ui/react-icons";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { GIST_BASE_PATH } from "../../../../config";
import { FileList } from "../../../components/FileList";
import { TypeTest } from "../../../components/TypeTest";
import {
  TextState,
  TypingTestResult,
} from "../../../components/TypeTest/useTypingTest";
import { useGetNextRandomGist } from "../../../hooks/useGetNextRandomGist";
import { useGistFilesQuery } from "../../../hooks/useGistFilesQuery";
import { Gist, GistFile, useGistQuery } from "../../../hooks/useGistQuery";
import { useGistsQuery } from "../../../hooks/useGistsQuery";
import { generateFilenameSlug } from "../../../utils/generateFilenameSlug";
import { generateGistPath } from "../../../utils/generateGistPath";
import { generateNextFileLink } from "../../../utils/generateNextFileLink";
import { getRandomGist } from "../../../utils/getRandomGist";

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
  const [randomGist, setRandomGist] = useState<Gist | null>(null);
  const nextFileButtonRef = useRef<HTMLAnchorElement>(null);
  const nextGistButtonRef = useRef<HTMLAnchorElement>(null);
  const [gistFilesWithResult, setGistFilesWithResults] = useState<
    GistFileWithResult[]
  >([]);
  const router = useRouter();
  const id = router.query.id;
  const [isTyping, setIsTyping] = useState(false);
  const username = router.query.username;
  const setNextRandomGist = (gists: Gist[]) => {
    setRandomGist(getRandomGist(gists));
  };
  const gistsQuery = useGistsQuery(
    typeof username === "string" ? username : "",
    {
      onSuccess: setNextRandomGist,
    }
  );

  const gistQuery = useGistQuery(typeof id === "string" ? id : "", {
    onSuccess: (gist) => {
      const hash = router.asPath.split("#")[1];
      if (!hash) {
        router.replace({
          hash: generateFilenameSlug(Object.values(gist.files)[0]!.filename),
        });
      }

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
  useGistFilesQuery(randomGist);
  const rawFilesQuery = useGistFilesQuery(gistQuery.data);
  const currentGistFile = useMemo(() => {
    const currentGistSlug = router.asPath.split("#")[1];
    return gistFilesWithResult.find(
      (gistFile) => generateFilenameSlug(gistFile.filename) === currentGistSlug
    );
  }, [router.asPath, gistFilesWithResult]);
  const allGistFilesCompleted = gistFilesWithResult.every(
    (gistFile) => gistFile.typingTest.isDone
  );
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
      nextGistButtonRef.current?.focus();
      nextFileButtonRef.current?.focus();
    },
    [currentGistFile, gistFilesWithResult]
  );
  const onStart = useCallback(() => {
    setIsTyping(true);
  }, []);

  useGetNextRandomGist(gistsQuery.data, username, setNextRandomGist);

  const restart = () => {
    setGistFilesWithResults((gistFiles) =>
      gistFiles.map((gistFile) => {
        if (
          generateFilenameSlug(gistFile.filename) ===
          generateFilenameSlug(currentGistFile?.filename ?? "")
        ) {
          gistFile.typingTest = { isDone: false };
        }
        return gistFile;
      })
    );
  };

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
          <Group>
            {gistFilesWithResult.length > 1 &&
              !isTyping &&
              !allGistFilesCompleted && (
                <Button
                  href={`#${generateNextFileLink(
                    gistFilesWithResult,
                    currentGistFile
                  )}`}
                  component={NextLink}
                  ref={nextFileButtonRef}
                  rightIcon={<ArrowRightIcon />}
                >
                  Next File
                </Button>
              )}
            {!isTyping && randomGist && typeof username === "string" && (
              <Button
                component={NextLink}
                href={generateGistPath(randomGist, username)}
                ref={nextGistButtonRef}
                rightIcon={<ShuffleIcon />}
                variant={allGistFilesCompleted ? "filled" : "default"}
              >
                Next Random Gist
              </Button>
            )}
            {currentGistFile.typingTest.isDone && (
              <Button
                onClick={restart}
                rightIcon={<ResetIcon />}
                variant="default"
              >
                Restart File
              </Button>
            )}
          </Group>
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
