import RegisterPage from "@/components/auth/RegisterPage";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";

const Register = () => {
	const toast = useToast();
	const router = useRouter();
	const [user, loading, error] = useAuthState(auth);

	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}
	if (user && !user?.emailVerified) {
		router.push("/auth/verify-email");
		return <PageLoadingSpinner />;
	}
	if (user) {
		router.push("/");
		return <PageLoadingSpinner />;
	}
	return <RegisterPage />;
};

export default Register;
