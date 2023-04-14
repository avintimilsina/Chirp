import SideBar from "@/components/ui/SideBar";
import theme from "@/config/theme";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
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
