import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

const GistForm = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const getGists = () => {
    router.push(`/${username}`);
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
            value={username}
            onChange={onChangeUsername}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={getGists}
          >
            Get Gists
          </button>
        </div>
      </div>
    </div>
  );
};

export default GistForm;
