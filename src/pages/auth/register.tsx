import RegisterPage from "@/components/auth/RegisterPage";
import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import withAuthPages from "@/routes/withAuthPages";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

// This is the register page.
const Register = () => {
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

export default withAuthPages(Register);
