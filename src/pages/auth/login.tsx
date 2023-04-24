import LoginPage from "@/components/auth/LoginPage";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import withAuthPages from "@/routes/withAuthPages";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

// This is the login page.
const Login = () => {
	const toast = useToast();
	const router = useRouter();
	const [user, loading, error] = useAuthState(auth);

	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}
	if (user) {
		router.push("/");
		if (!toast.isActive("login")) {
			toast({
				title: `You are already logged in`,
				status: "info",
				isClosable: true,
				id: "login",
			});
		}
		return <PageLoadingSpinner />;
	}
	return <LoginPage />;
};

export default withAuthPages(Login);
