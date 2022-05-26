import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { TypeTest } from "../../components/Typer";
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
  const rawFile = useRawFile(gistFilesRawUrls?.[0] ?? "");

  return <TypeTest text={rawFile.data || ""} />;
};

export default GistPage;
