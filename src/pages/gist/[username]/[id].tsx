import { Center, Container, Loader, Title } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { generateFilenameSlug } from ".";
import { FileList } from "../../../components/FileList";
import { GistCard } from "../../../components/GistCard/GistCard";
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
  const router = useRouter();
  const id = router.query.id as string;
  const [gistFilesWithResult, setGistFilesWithResults] = useState<
    GistFileWithResult[]
  >([]);
  const gistQuery = useGistQuery(id, {
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
    },
    [currentGistFile, gistFilesWithResult]
  );

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  if (gistQuery.isSuccess && !currentGistFile) {
    return (
      <GistCard
        id={id}
        description={gistQuery.data.description}
        username={
          typeof router.query.username === "string" ? router.query.username : ""
        }
        files={gistQuery.data.files}
      />
    );
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
        {gistQuery.data?.description && (
          <Title
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            mb="md"
          >
            {gistQuery.data?.description}
          </Title>
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
        />
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
