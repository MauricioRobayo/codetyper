import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../../components/Button";
import { Gist } from "../../hooks/useGist";
import { useGists } from "../../hooks/useGists";

const UserPage = () => {
  const router = useRouter();
  const [gists, setGists] = useState<Gist[] | null>(null);
  const username = router.query.username as string;

  const gistsQuery = useGists(username, { onSuccess: setGists });

  if (gistsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (gistsQuery.isError) {
    return <div>Something unexpected happened!</div>;
  }

  const startRandomTypeTest = () => {
    if (!gists) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * gists.length);
    router.push(`/${username}/${gists[randomIndex].id}`);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Button onClick={startRandomTypeTest}>
            Start Random Typing Test
          </Button>
        </div>
      </div>
      <ul>
        {gists?.map(({ id, description }) => (
          <li key={id}>
            <Link href={`/${username}/${id}`}>{description}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserPage;
