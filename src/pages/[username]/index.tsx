import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
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
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={startRandomTypeTest}
          >
            Random
          </button>
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
