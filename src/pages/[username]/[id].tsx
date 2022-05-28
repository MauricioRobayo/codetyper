import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { TypeTest } from "../../components/TypeTest";
import { useGist } from "../../hooks/useGist";
import { useRawFiles } from "../../hooks/useRawFiles";

const GistPage: NextPage = () => {
  const { query } = useRouter();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const gistQuery = useGist(typeof query.id === "string" ? query.id : "");
  const gistFilesRawUrls = useMemo(() => {
    if (gistQuery.data) {
      return Object.values(gistQuery.data.files).map(({ raw_url }) => raw_url);
    }

    return null;
  }, [gistQuery.data]);

  const rawFilesQuery = useRawFiles(gistFilesRawUrls ?? []);

  if (rawFilesQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  const onFinish = () => {
    if (
      !rawFilesQuery.data ||
      currentFileIndex >= rawFilesQuery.data.length - 1
    ) {
      return;
    }

    setCurrentFileIndex(currentFileIndex + 1);
  };

  if (rawFilesQuery.isSuccess) {
    return (
      <TypeTest
        text={rawFilesQuery.data[currentFileIndex]}
        onFinish={onFinish}
      />
    );
  }

  return <div>Loading...</div>;
};

export default GistPage;
