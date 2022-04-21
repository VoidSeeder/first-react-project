import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import MenuBar from "../components/MenuBar";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="bg-slate-500 h-screen w-screen flex flex-col justify-between">
                <MenuBar />
                <div className="grow">
                    <Component {...pageProps} />
                </div>
                <footer>
                    <Footer />
                </footer>
            </main>
        </div>
    );
}

export default MyApp;
