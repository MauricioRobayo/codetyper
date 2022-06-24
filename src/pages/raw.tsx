import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { TypeTest } from "../components/TypeTest";
import {
  TextState,
  TypingTestResult,
} from "../components/TypeTest/useTypingTest";
import { useRawFileQuery } from "../hooks/useRawFileQuery";

export default function RawPage() {
  const { query } = useRouter();

  const rawFileQuery = useRawFileQuery(
    typeof query.url === "string" ? query.url : ""
  );

  const text = useMemo(() => {
    if (rawFileQuery.data) {
      return rawFileQuery.data;
    }

    if (typeof query.text === "string") {
      return decodeURIComponent(query.text);
    }

    return "";
  }, [rawFileQuery.data, query.text]);

  const onFinish = useCallback(
    (textState: TextState, result: TypingTestResult) => {
      alert(JSON.stringify(result, null, 2));
    },
    []
  );

  return <TypeTest text={text} onFinish={onFinish} />;
}
