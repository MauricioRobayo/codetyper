import type { NextPage } from "next";
import Head from "next/head";
import { Typer } from "../components/Typer";

const Home: NextPage = () => {
  const sampleText = `let str = "1 turkey has a discount of 30%";

alert(str.match(/\d+(?=%)/)); // 30, the number 1 is ignored, as it's not followed by %`;

  return (
    <div>
      <Head>
        <title>Code Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>code typer</h1>
      </header>
      <main>
        <Typer
          text={sampleText}
          className="bg-slate-800 text-green-500 rounded-sm my-4 p-4"
        />
      </main>
    </div>
  );
};

export default Home;
