import { Center, Container } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { GistForm } from "../../components/GistForm";

const GistPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gist Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Center>
          <GistForm showHeader />
        </Center>
      </Container>
    </>
  );
};

export default GistPage;
