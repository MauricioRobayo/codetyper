import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { generateFilenameSlug } from ".";
import { TypeTest } from "../../components/TypeTest";
import { useCurrentGistFile } from "../../hooks/useFileSlug";
import { useGist } from "../../hooks/useGist";
import { useRawFiles } from "../../hooks/useRawFiles";

const GistPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const username = router.query.username as string;
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
  const {
    state: { gistFile, autoAdvanceFile },
    setFileSlug,
  } = useCurrentGistFile(gistFiles, currentFileIndex);

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
    const currentGistFile = gistFiles[nextFileIndex];

    if (currentGistFile) {
      setCurrentFileIndex(nextFileIndex);
      const hash = generateFilenameSlug(currentGistFile.filename);
      setFileSlug(hash);
      router.push({ hash });
    }
  };

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  if (rawFilesQuery.isSuccess && gistFile) {
    const text =
      rawFilesQuery.data[autoAdvanceFile ? currentFileIndex : gistFile.index];
    if (!text) {
      return <div>No text found!</div>;
    }

    return <TypeTest text={text} onFinish={onFinish} />;
  }

  return <div>Loading...</div>;
};

export default GistPage;
