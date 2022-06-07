import { Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import GistForm from "../components/GistForm";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Gist Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Title>Gist typer</Title>
      </header>
      <main>
        <GistForm />
      </main>
    </div>
  );
};

export default Home;
