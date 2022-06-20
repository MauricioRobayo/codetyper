import { useRouter } from "next/router";
import { TypeTest } from "../components/TypeTest";
import { TypingTestResult } from "../components/TypeTest/TypeTest";
import { useRawFile } from "../hooks/useRawFile";

export default function RawPage() {
  const { query } = useRouter();

  const rawFileQuery = useRawFile(
    typeof query.url === "string" ? query.url : ""
  );

  const onFinish = (result: TypingTestResult) => {
    alert(JSON.stringify(result, null, 2));
  };

  if (rawFileQuery.isSuccess) {
    return <TypeTest text={rawFileQuery.data} onFinish={onFinish} />;
  }

  return <div>Raw Text</div>;
}
