import SideBar from "@/components/ui/SideBar";
import theme from "@/config/theme";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";

// NPogress is a progress bar that shows up on the top of the page when the page is loading.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
	const [currentUser] = useAuthState(auth);
	const router = useRouter();
	useEffect(() => {
		const setUser = async () => {
			if (currentUser) {
				// If the user is logged in, then set the user's data in the database under the users collection and merges the data with the data obtained from the AccountSetting page where the user can add their location, bio, change their profile and coverphoto and more in the same "users" collection.
				await setDoc(
					doc(db, "users", currentUser?.uid),
					{
						email: currentUser?.email,
						photoURL: currentUser?.photoURL,
						displayName: currentUser?.displayName,
						uid: currentUser?.uid,
						phoneNumber: currentUser?.phoneNumber,
						providerData: currentUser?.providerData,
						emailVerified: currentUser?.emailVerified,
						username: currentUser?.email?.split("@")[0],
						createdAt: currentUser?.metadata?.creationTime,
					},
					{ merge: true }
				);
			}
		};

		setUser();
	}, [currentUser]);

	return (
		<ChakraProvider theme={theme}>
			{router.pathname.startsWith("/auth") ? (
				<Component {...pageProps} />
			) : (
				<SideBar>
					<Component {...pageProps} />
				</SideBar>
			)}
		</ChakraProvider>
	);
};
export default App;
