import { useToast } from "@chakra-ui/react";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

const LogOut = () => {
	const [signOut] = useSignOut(auth);
	const toast = useToast();
	return (
		<button
			onClick={async () => {
				const success = await signOut();
				if (success) {
					if (!toast.isActive("login")) {
						toast({
							title: `Logged out`,
							status: "success",
							isClosable: true,
							id: "login",
						});
					}
				}
			}}
		>
			Log Out
		</button>
	);
};

export default LogOut;
