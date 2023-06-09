import { Link } from "@chakra-ui/next-js";
import {
	Box,
	Flex,
	Heading,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => (
	<Flex
		minH="100vh"
		align="center"
		justify="center"
		bg={useColorModeValue("gray.50", "gray.800")}
	>
		<Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
			<Stack align="center">
				<Heading fontSize="4xl" textAlign="center">
					Sign up
				</Heading>
			</Stack>
			<Box
				rounded="lg"
				bg={useColorModeValue("white", "gray.700")}
				boxShadow="lg"
				p={8}
			>
				<Stack spacing={4}>
					{/* Calling the RegisterForm component here: */}
					<RegisterForm />
					<Stack>
						<Text align="center">
							Already a user?{" "}
							{/* if you already have an account, you can login here. */}
							<Link href="/auth/login" color="blue.400">
								Login
							</Link>
						</Text>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	</Flex>
);
export default RegisterPage;
