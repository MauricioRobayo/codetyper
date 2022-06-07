import { Button, Center, Group, Input, InputWrapper } from "@mantine/core";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const GistForm = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/${username}`);
  };

  return (
    <Center>
      <form onSubmit={onHandleSubmit} action="#">
        <Group direction="column">
          <InputWrapper
            id="github-username"
            label="GitHub Username"
            description="Please enter your GitHub username to get your gists."
          >
            <Input
              id="github-username"
              placeholder="GitHub username"
              value={username}
              onChange={onChangeUsername}
            />
          </InputWrapper>
          <Button type="submit">Get Gists</Button>
        </Group>
      </form>
    </Center>
  );
};

export default GistForm;
