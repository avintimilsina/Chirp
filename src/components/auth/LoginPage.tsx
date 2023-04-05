import { Link } from "@chakra-ui/next-js";
import {
	Box,
	Button,
	Flex,
	Heading,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../../firebase";
import LoginForm from "./LoginForm";

const LoginPage = () => {
	const [signInWithGoogle] = useSignInWithGoogle(auth);

	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4}>
						<LoginForm />

						<Button
							variant="outline"
							colorScheme="blue"
							onClick={async () => {
								await signInWithGoogle();
							}}
							leftIcon={<FcGoogle />}
						>
							Sign-in with Google
						</Button>
						<Stack pt={1}>
							<Text align={"center"}>
								Don&apos;t have an account?{" "}
								<Link href="/auth/register" color={"blue.400"}>
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

export default LoginPage;
