import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { TypeTest } from "../../components/TyperTest";
import { useGist } from "../../hooks/useGist";
import { useRawFile } from "../../hooks/useRawFile";

const GistPage: NextPage = () => {
  const { query } = useRouter();

  const gistQuery = useGist(typeof query.id === "string" ? query.id : "");
  const gistFilesRawUrls = useMemo(() => {
    if (gistQuery.data) {
      return Object.values(gistQuery.data.files).map(({ raw_url }) => raw_url);
    }

    return null;
  }, [gistQuery.data]);
  const rawFileQuery = useRawFile(gistFilesRawUrls?.[0] ?? "");

  if (rawFileQuery.isError || gistQuery.isError) {
    <div>Something wrong happened!</div>;
  }

  if (rawFileQuery.isSuccess) {
    return <TypeTest text={rawFileQuery.data} />;
  }

  return <div>Loading...</div>;
};

export default GistPage;
