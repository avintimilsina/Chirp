import { Link } from "@chakra-ui/next-js";
import { NextPage } from "next";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const HomePage: NextPage = () => {
	const [signOut] = useSignOut(auth);

	return (
		<div>
			<h1>HomePage</h1>
			<Link href="/auth/login">Login In</Link>
			<button
				onClick={async () => {
					await signOut();
				}}
			>
				Log Out
			</button>
			<Link href="/auth/register">Register</Link>
		</div>
	);
};

export default HomePage;
