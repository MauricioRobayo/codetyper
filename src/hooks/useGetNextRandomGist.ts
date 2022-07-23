import { useRouter } from "next/router";
import { useEffect } from "react";
import { Gist } from "./useGistQuery";

export function useGetNextRandomGist(
  gists: Gist[] | undefined,
  username: string | string[] | undefined,
  setNextRandomGistPath: (gists: Gist[], username: string) => void
) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      if (gists && typeof username === "string") {
        setNextRandomGistPath(gists, username);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [gists, router.events, setNextRandomGistPath, username]);
}
