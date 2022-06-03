import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { generateFilenameSlug } from ".";
import { TypeTest } from "../../components/TypeTest";
import { useGist } from "../../hooks/useGist";
import { useRawFiles } from "../../hooks/useRawFiles";

const GistPage: NextPage = () => {
  const [fileSlug, setFileSlug] = useState<string | null>(null);
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
      !gistFiles ||
      gistFiles.length === 0 ||
      !autoAdvanceFile ||
      !rawFilesQuery.data ||
      currentFileIndex >= rawFilesQuery.data.length - 1
    ) {
      router.push(`/${username}`);
      return;
    }

    const nextFileIndex = currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
    const hash = generateFilenameSlug(gistFiles[nextFileIndex].filename);
    setFileSlug(hash);
    router.push({ hash });
  };

  const gistFile = useMemo(() => {
    if (fileSlug === null) {
      return;
    }

    return gistFiles
      ?.map(({ filename }, index) => ({ filename, index }))
      .find((gistFile) => generateFilenameSlug(gistFile.filename) === fileSlug);
  }, [gistFiles, fileSlug]);

  useEffect(() => {
    const [, fileSlugFromHash] = asPath.split("#");

    if (isReady && autoAdvanceFile === null) {
      setAutoAdvanceFile(!fileSlugFromHash);
    }

    if (isReady && gistFiles && !fileSlugFromHash) {
      const hash = generateFilenameSlug(gistFiles[currentFileIndex].filename);
      setFileSlug(hash);
      router.push({ hash });
      return;
    }

    setFileSlug(fileSlugFromHash);
  }, [asPath, autoAdvanceFile, currentFileIndex, gistFiles, isReady, router]);

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
