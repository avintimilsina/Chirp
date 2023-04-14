import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import {
	Flex,
	Heading,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

const ForgotPassword = () => (
	<Flex
		minH="100vh"
		align="center"
		justify="center"
		bg={useColorModeValue("gray.50", "gray.800")}
	>
		<Stack
			spacing={4}
			w="full"
			maxW="md"
			bg={useColorModeValue("white", "gray.700")}
			rounded="xl"
			boxShadow="lg"
			p={6}
			my={12}
		>
			<Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
				Forgot your password?
			</Heading>
			<Text
				fontSize={{ base: "sm", sm: "md" }}
				color={useColorModeValue("gray.800", "gray.400")}
			>
				You&apos;ll get an email with a reset link.
			</Text>
			<ForgotPasswordForm />
		</Stack>
	</Flex>
);

export default ForgotPassword;
