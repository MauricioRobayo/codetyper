import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { TypeTest } from "../components/TypeTest";
import { TypingTestResult } from "../components/TypeTest/useTypingTest";
import { useRawFile } from "../hooks/useRawFile";

export default function RawPage() {
  const { query } = useRouter();

  const rawFileQuery = useRawFile(
    typeof query.url === "string" ? query.url : ""
  );

  const text = useMemo(() => {
    if (rawFileQuery.data) {
      return rawFileQuery.data;
    }

    if (typeof query.text === "string") {
      return query.text;
    }

    return "";
  }, [rawFileQuery.data, query.text]);

  const onFinish = useCallback((result: TypingTestResult) => {
    alert(JSON.stringify(result, null, 2));
  }, []);

  return <TypeTest text={text} onFinish={onFinish} />;
}
