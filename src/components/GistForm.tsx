import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { Gist } from "../hooks/useGist";
import { useGists } from "../hooks/useGists";

const GistForm = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [descriptionFilterValue, setDescriptionFilterValue] = useState("");
  const [gists, setGists] = useState<Gist[]>([]);
  const [username, setUsername] = useState("");
  const gistsQuery = useGists(username, (gists) => setGists(gists));
  const router = useRouter();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(e.target.value);
  };

  const onChangeDescriptionFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setDescriptionFilterValue(e.target.value);
    if (!gistsQuery.data || gistsQuery.data.length === 0) {
      return;
    }

    setGists(
      gistsQuery.data.filter(({ description }) =>
        description.includes(e.target.value)
      )
    );
  };

  const getGists = () => {
    setUsername(usernameValue);
    gistsQuery.refetch();
  };

  const typeTestRandom = () => {
    const randomIndex = Math.floor(Math.random() * gists.length);
    router.push(`/gist/${gists[randomIndex].id}`);
  };

  return (
    <div>
      <div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={usernameValue}
            onChange={onChangeUsername}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="filter"
          >
            Description filter
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="filter"
            type="text"
            placeholder="Description filter"
            value={descriptionFilterValue}
            onChange={onChangeDescriptionFilter}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            disabled={usernameValue === ""}
            onClick={getGists}
          >
            Get Gists
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            disabled={!gists || gists.length === 0}
            onClick={typeTestRandom}
          >
            Random
          </button>
        </div>
      </div>
      <div>
        {gistsQuery.isIdle && null}
        {gistsQuery.isError && "Something unexpected happened!"}
        {gistsQuery.isFetching && "Loading..."}
        {gistsQuery.isSuccess && (
          <ul>
            {gists.map(({ id, description }) => (
              <li key={id}>
                <Link href={`/gist/${id}`}>{description}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GistForm;
