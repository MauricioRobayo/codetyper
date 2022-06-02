import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { generateFilenameSlug } from ".";
import { TypeTest } from "../../components/TypeTest";
import { GistFile, useGist } from "../../hooks/useGist";
import { useRawFiles } from "../../hooks/useRawFiles";

const GistPage: NextPage = () => {
  const [filename, setFilename] = useState<string | null>(null);
  const [autoAdvanceFile, setAutoAdvanceFile] = useState<boolean | null>(null);
  const router = useRouter();
  const { query, asPath, isReady } = router;
  const id = query.id as string;
  const username = query.username as string;
  const gistQuery = useGist(id);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const gistFiles = useMemo(() => {
    if (gistQuery.data) {
      return Object.values(gistQuery.data.files);
    }

    return null;
  }, [gistQuery.data]);
  const rawFilesQuery = useRawFiles(
    gistFiles?.map(({ raw_url }) => raw_url) ?? []
  );
  const onFinish = () => {
    if (
      !autoAdvanceFile ||
      !rawFilesQuery.data ||
      currentFileIndex >= rawFilesQuery.data.length - 1
    ) {
      router.push(`/${username}`);
      return;
    }

    setCurrentFileIndex(currentFileIndex + 1);
  };

  const gistFile = useMemo(() => {
    if (filename === null) {
      return;
    }

    return gistFiles
      ?.map(({ filename }, index) => ({ filename, index }))
      .find((gistFile) => generateFilenameSlug(gistFile.filename) === filename);
  }, [gistFiles, filename]);

  useEffect(() => {
    if (!isReady || filename) {
      return;
    }

    const [, fileSlug] = asPath.split("#");
    setAutoAdvanceFile(autoAdvanceFile || !fileSlug);
    setFilename(fileSlug);
  }, [isReady, query, asPath, autoAdvanceFile, filename]);

  useEffect(() => {
    if (!autoAdvanceFile || !gistFiles || gistFiles.length === 0) {
      return;
    }

    router.push({
      hash: generateFilenameSlug(gistFiles[currentFileIndex].filename),
    });
  }, [autoAdvanceFile, currentFileIndex, router, gistFiles]);

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  if (rawFilesQuery.isSuccess && gistFile) {
    const text =
      rawFilesQuery.data[autoAdvanceFile ? currentFileIndex : gistFile.index];
    return <TypeTest text={text} onFinish={onFinish} />;
  }

  return <div>Loading...</div>;
};

export default GistPage;
