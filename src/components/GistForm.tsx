import {
  Button,
  Center,
  Group,
  Input,
  InputWrapper,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { GIST_BASE_PATH } from "../../config";

const GistForm = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${GIST_BASE_PATH}/${username}`);
  };

  return (
    <Center>
      <form onSubmit={onHandleSubmit} action="#">
        <Group direction="column">
          <TextInput
            label="GitHub Username"
            description="Please enter your GitHub username to get your gists."
            placeholder="GitHub username"
            value={username}
            onChange={onChangeUsername}
          />
          <Button type="submit">Get Gists</Button>
        </Group>
      </form>
    </Center>
  );
};

export default GistForm;
