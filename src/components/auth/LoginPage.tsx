import { Link } from "@chakra-ui/next-js";
import {
	Box,
	Button,
	Flex,
	Heading,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../../firebase";
import LoginForm from "./LoginForm";

interface LoginPageProps {
	isInModal?: boolean;
}
const LoginPage = ({ isInModal }: LoginPageProps) => {
	const [signInWithGoogle] = useSignInWithGoogle(auth);
	const router = useRouter();
	const toast = useToast();

	return (
		<Flex
			minH={isInModal ? undefined : "100vh"}
			align="center"
			justify="center"
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack
				spacing={isInModal ? 4 : 8}
				mx="auto"
				maxW="lg"
				py={isInModal ? 6 : 12}
				px={6}
			>
				<Stack align="center">
					<Heading fontSize="4xl">Sign in to your account</Heading>
				</Stack>
				<Box
					rounded="lg"
					bg={useColorModeValue("white", "gray.700")}
					boxShadow="lg"
					p={8}
				>
					<Stack spacing={4}>
						<LoginForm />
						{/* Sign in With Google hook from react firebase hooks */}
						<Button
							variant="outline"
							colorScheme="blue"
							leftIcon={<FcGoogle />}
							onClick={async () => {
								const response = await signInWithGoogle();

								if (response) {
									router.push("/");
									if (!toast.isActive("login")) {
										toast({
											title: `Successfully logged in`,
											status: "success",
											isClosable: true,
											id: "login",
										});
									}
								}
							}}
						>
							Sign-in with Google
						</Button>
						<Stack pt={1}>
							<Text align="center">
								Don&apos;t have an account?{" "}
								<Link href="/auth/register" color="blue.400">
									Register
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};
LoginPage.defaultProps = {
	isInModal: false,
};
export default LoginPage;
