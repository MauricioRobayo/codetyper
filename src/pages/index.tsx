import type { NextPage } from "next";
import Head from "next/head";
import { TypeTest } from "../components/Typer";

const Home: NextPage = () => {
  const sampleText = `test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});

test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toMatch('error');
});`;

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
        <TypeTest text={sampleText} />
      </main>
    </div>
  );
};

export default Home;
