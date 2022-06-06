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
        <div>
          <label htmlFor="username">GitHub Username</label>
          <input
            id="username"
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={onChangeUsername}
          />
        </div>
        <div>
          <button type="button" onClick={getGists}>
            Get Gists
          </button>
        </div>
      </div>
    </div>
  );
};

export default GistForm;
