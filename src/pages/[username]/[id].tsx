import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { TypeTest } from "../../components/TypeTest";
import { useGist } from "../../hooks/useGist";
import { useRawFiles } from "../../hooks/useRawFiles";

const GistPage: NextPage = () => {
  const router = useRouter();
  const { query, asPath } = router;
  const id = query.id as string;
  const username = query.username as string;
  const auto = query.auto as string;
  const filename = asPath.replace(/.*#/, "");
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

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  useEffect(() => {
    if (!gistFiles || gistFiles.length === 0) {
      return;
    }

    router.push({
      hash: `file-${gistFiles[currentFileIndex].filename}`,
    });
  }, [currentFileIndex, router, gistFiles]);

  const onFinish = () => {
    if (
      !auto ||
      !rawFilesQuery.data ||
      currentFileIndex >= rawFilesQuery.data.length - 1
    ) {
      router.push(`/${username}`);
      return;
    }

    setCurrentFileIndex(currentFileIndex + 1);
  };

  const gistFile = useMemo(() => {
    return gistFiles
      ?.map(({ filename }, index) => ({ filename, index }))
      .find((gistFile) => gistFile.filename === filename.replace("file-", ""));
  }, [gistFiles, filename]);

  if (rawFilesQuery.isSuccess && gistFile) {
    console.log({ currentFileIndex });
    const text = rawFilesQuery.data[auto ? currentFileIndex : gistFile.index];
    return <TypeTest text={text} onFinish={onFinish} />;
  }

  return <div>Loading...</div>;
};

export default GistPage;
