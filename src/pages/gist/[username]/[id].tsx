import { Center, Group, Loader, Text, Title, Container } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { ArrowRight, Clock } from "tabler-icons-react";
import { generateFilenameSlug } from ".";
import { TypeTest } from "../../../components/TypeTest";
import { TypingTestResult } from "../../../components/TypeTest/useTypingTest";
import { useCurrentGistFile } from "../../../hooks/useCurrentGistFile";
import { useGistQuery } from "../../../hooks/useGistQuery";
import { useRawFilesQuery } from "../../../hooks/useRawFilesQuery";

const GistPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const gistQuery = useGistQuery(id);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const gistFiles = useMemo(() => {
    if (gistQuery.data) {
      return Object.values(gistQuery.data.files);
    }

    return null;
  }, [gistQuery.data]);
  const rawFilesQuery = useRawFilesQuery(
    gistFiles?.map(({ raw_url }) => raw_url) ?? []
  );
  const {
    state: { gistFile, autoAdvanceFile },
    setFileSlug,
  } = useCurrentGistFile(gistFiles, currentFileIndex);

  const onFinish = useCallback(
    (results: TypingTestResult) => {
      alert(JSON.stringify(results, null, 2));

      const nextFileIndex = currentFileIndex + 1;
      const currentGistFile = gistFiles?.[nextFileIndex];

      if (currentGistFile && autoAdvanceFile) {
        setCurrentFileIndex(nextFileIndex);
        const hash = generateFilenameSlug(currentGistFile.filename);
        setFileSlug(hash);
        router.push({ hash });
      }
    },
    [autoAdvanceFile, currentFileIndex, gistFiles, router, setFileSlug]
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
        {autoAdvanceFile ? (
          <Group direction="column" spacing={0}>
            {gistFiles?.map(({ filename, raw_url }) => (
              <Text
                key={raw_url}
                color={filename === gistFile.filename ? "" : "dimmed"}
                size={filename === gistFile.filename ? "md" : "sm"}
                weight={filename === gistFile.filename ? "bold" : "normal"}
              >
                <Group spacing="xs">
                  {filename === gistFile.filename ? (
                    <ArrowRight size={16} strokeWidth={3} />
                  ) : (
                    <Clock size={14} />
                  )}
                  {filename}
                </Group>
              </Text>
            ))}
          </Group>
        ) : (
          <Text>{gistFile.filename}</Text>
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
