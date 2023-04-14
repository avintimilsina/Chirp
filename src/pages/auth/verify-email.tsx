import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import {
	Button,
	Center,
	Flex,
	Heading,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
	useAuthState,
	useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

const VerifyEmail = () => {
	const router = useRouter();
	const [user, loading, error] = useAuthState(auth);
	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}
	if (user?.emailVerified) {
		router.push("/");
		return <PageLoadingSpinner />;
	}
	if (!user) {
		router.push("/auth/register");
		return <PageLoadingSpinner />;
	}
	return (
		<div>
			<VerifyEmailPage user={user} />
		</div>
	);
};
interface VerifyEmailPageProps {
	user: User;
}
const VerifyEmailPage = ({ user }: VerifyEmailPageProps) => {
	const [sendEmailVerification] = useSendEmailVerification(auth);
	const toast = useToast();
	const router = useRouter();

	return (
		<Flex
			minH="100vh"
			align="center"
			justify="center"
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack
				spacing={4}
				w="full"
				maxW="sm"
				bg={useColorModeValue("white", "gray.700")}
				rounded="xl"
				boxShadow="lg"
				p={6}
				my={10}
			>
				<Center>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
						Verify your Email
					</Heading>
				</Center>
				<Center
					fontSize={{ base: "sm", sm: "md" }}
					color={useColorModeValue("gray.800", "gray.400")}
				>
					We have sent a verification email to you
				</Center>
				<Center
					fontSize={{ base: "sm", sm: "md" }}
					fontWeight="bold"
					color={useColorModeValue("gray.800", "gray.400")}
				>
					{user.email}
				</Center>
				<Button
					colorScheme="green"
					onClick={async () => {
						router.reload();
					}}
				>
					Already Verified?
				</Button>
				<Stack spacing={6}>
					<Stack>
						<Text align="center">
							Didn&apos;t receive a email?{" "}
							<Button
								variant="link"
								onClick={async () => {
									const emailVerification = await sendEmailVerification();
									if (emailVerification) {
										toast({
											title: `Email verification sent`,
											status: "success",
											isClosable: true,
											id: "email-verification",
										});
									}
								}}
							>
								Resend Email
							</Button>
						</Text>
					</Stack>
				</Stack>
			</Stack>
		</Flex>
	);
};

export default VerifyEmail;
