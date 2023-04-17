import SideBar from "@/components/ui/SideBar";
import theme from "@/config/theme";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import NProgress from "nprogress";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import { doc, setDoc } from "firebase/firestore";
import "nprogress/nprogress.css";
import { auth, db } from "../../firebase";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
	const [currentUser, loading] = useAuthState(auth);
	const router = useRouter();
	useEffect(() => {
		const setUser = async () => {
			if (currentUser) {
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

	if (loading) return <PageLoadingSpinner />;
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
