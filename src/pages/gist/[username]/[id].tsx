import { Center, Container, Loader, Title } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { generateFilenameSlug } from ".";
import { FileList } from "../../../components/FileList";
import { TypeTest } from "../../../components/TypeTest";
import { TypingTestResult } from "../../../components/TypeTest/useTypingTest";
import { useCurrentGistFile } from "../../../hooks/useCurrentGistFile";
import { GistFile, useGistQuery } from "../../../hooks/useGistQuery";
import { useRawFilesQuery } from "../../../hooks/useRawFilesQuery";

export type GistFileWithResult = GistFile & {
  typingTestResult?: TypingTestResult;
};

const GistPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const gistQuery = useGistQuery(id);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [gistFilesWithResult, setGistFilesWithResults] = useState<
    GistFileWithResult[]
  >([]);

  useEffect(() => {
    if (gistQuery.data?.files) {
      setGistFilesWithResults(Object.values(gistQuery.data.files));
    }
  }, [gistQuery.data]);

  const rawFilesQuery = useRawFilesQuery(
    gistFilesWithResult?.map(({ raw_url }) => raw_url) ?? []
  );
  const {
    state: { gistFile, autoAdvanceFile },
    setFileSlug,
  } = useCurrentGistFile(gistFilesWithResult, currentFileIndex);

  const onFinish = useCallback(
    (result: TypingTestResult) => {
      const currentFile = gistFilesWithResult[currentFileIndex];

      if (currentFile) {
        currentFile.typingTestResult = result;
      }

      const nextFileIndex = currentFileIndex + 1;
      const currentGistFile = gistFilesWithResult?.[nextFileIndex];

      setGistFilesWithResults([...gistFilesWithResult]);

      if (currentGistFile && autoAdvanceFile) {
        const hash = generateFilenameSlug(currentGistFile.filename);
        setCurrentFileIndex(nextFileIndex);
        setFileSlug(hash);
        router.push({ hash });
      }
    },
    [
      autoAdvanceFile,
      currentFileIndex,
      gistFilesWithResult,
      router,
      setFileSlug,
    ]
  );

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  if (rawFilesQuery.isSuccess && gistFile) {
    const text =
      rawFilesQuery.data[autoAdvanceFile ? currentFileIndex : gistFile.index];
    if (!text) {
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
            gistFiles={
              autoAdvanceFile
                ? gistFilesWithResult
                : [gistFilesWithResult[gistFile.index]!]
            }
            activeGistIndex={gistFile.index}
          />
        )}
        <TypeTest text={text} onFinish={onFinish} />
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
