import { Code, Container, List, Text, Anchor, Kbd } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { GistForm } from "../components/GistForm";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Code Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container my="xl">
        <List type="ordered">
          <List.Item>
            Create a gist with the snippet of code you want to practice, for
            example:{" "}
            <Anchor href="https://gist.github.com/MauricioRobayo/d6bf88f90a8d0b28e0847f3ac32df11b">
              https://gist.github.com/MauricioRobayo/d6bf88f90a8d0b28e0847f3ac32df11b
            </Anchor>
          </List.Item>
          <List.Item>
            On the gist url, replace <Code>gist.github.com</Code> with{" "}
            <Code>codetyper.io/gist</Code>:{" "}
            <Link
              href="/gist/MauricioRobayo/d6bf88f90a8d0b28e0847f3ac32df11b"
              passHref
            >
              <Anchor>
                https://codetyper.io/gist/MauricioRobayo/d6bf88f90a8d0b28e0847f3ac32df11b
              </Anchor>
            </Link>
          </List.Item>
          <List.Item>Practice</List.Item>
        </List>
      </Container>
      <Container>
        <Text mb="md">
          To get all of your gists go to{" "}
          <Code>https://codetyper.io/gist/&lt;YOUR GITHUB USERNAME&gt;</Code>,
          or enter your GitHub username below ant hit <Kbd>Enter</Kbd>:
        </Text>
        <GistForm />
      </Container>
    </>
  );
};

export default Home;
