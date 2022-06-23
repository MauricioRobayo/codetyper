import { Button, Center, Group, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { GIST_BASE_PATH } from "../../config";

interface GistFormProps {
  username?: string;
  loading?: boolean;
}
const GistForm = ({ username = "", loading = false }: GistFormProps) => {
  const [value, setValue] = useState(username);
  const router = useRouter();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${GIST_BASE_PATH}/${value}`);
  };

  return (
    <Center>
      <form onSubmit={onHandleSubmit} action="#">
        <Group sx={{ alignItems: "flex-end" }}>
          <TextInput
            label="GitHub Username"
            description="Please enter your GitHub username to get your gists."
            placeholder="GitHub username"
            value={value}
            onChange={onChangeUsername}
          />
          <Button type="submit" loading={loading}>
            Get Gists
          </Button>
        </Group>
      </form>
    </Center>
  );
};

export default GistForm;
