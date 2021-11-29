import { getSession } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

export default function Home() {
	return (
		// giving height of the screen and hiding overflow
		<div className="bg-black h-screen overflow-hidden">
			<Head>
				<title>Spotify-clone-7thsem</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex">
				<Sidebar />
				<Center />
			</main>

			<div className="sticky bottom-0">
				<Player />
			</div>
		</div>
	);
}

// pre-fetch the session before serving to client-side
export async function getServerSideProps(context) {
	const session = await getSession(context);

	return {
		props: {
			session,
		},
	};
}
