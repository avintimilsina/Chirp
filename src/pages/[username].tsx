import {
	Avatar,
	Box,
	Button,
	Card,
	Flex,
	HStack,
	Heading,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";

import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import TweetCard from "@/components/ui/TweetCard";
import dayjs from "dayjs";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaEnvelope } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { GoCalendar } from "react-icons/go";
import { Tweet } from ".";
import { auth, db } from "../../firebase";

const ProfilePage = () => {
	const router = useRouter();
	const { username } = router.query;
	const [, userloading] = useAuthState(auth);
	const [value] = useCollectionData(
		query(collection(db, "users"), where("username", "==", username)),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [values, loading, error] = useCollectionData(
		query(
			collection(db, "chirps"),
			where("author.userId", "==", value?.[0].uid ?? "-")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (loading || userloading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}
	if (value?.length === 0) {
		return (
			<Box textAlign="center" py={10} px={6}>
				<Heading
					display="inline-block"
					as="h2"
					size="2xl"
					bgGradient="linear(to-r, teal.400, teal.600)"
					backgroundClip="text"
				>
					404
				</Heading>
				<Text fontSize="18px" mt={3} mb={2}>
					User Not Found
				</Text>
				<Text color="gray.500" mb={6}>
					The user you&apos;re looking for does not seem to exist.
				</Text>

				<Button
					colorScheme="teal"
					bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
					color="white"
					variant="solid"
					onClick={() => {
						router.push("/");
					}}
				>
					Go to Home
				</Button>
			</Box>
		);
	}
	return (
		<>
			<Card width="full" maxW="3xl" mb={3}>
				<Flex
					mb={8}
					direction="column"
					alignItems="center"
					justifyContent="center"
				>
					<Box
						bg="#edf3f8"
						_dark={{ bg: "#3e3e3e" }}
						style={{
							backgroundImage: `url(${
								value?.[0].coverPhoto || "https://picsum.photos/200/300"
							})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
						height="300px"
						width="100%"
						borderRadius="lg"
						pt={200}
						px={4}
						display="flex"
						alignItems="left"
					>
						<Avatar
							src={value?.[0].photoURL || "https://picsum.photos/200/300"}
							name="Profile Picture"
							borderRadius="full"
							boxSize="150px"
							shadow="lg"
							border="5px solid"
							mb={-20}
							borderColor="gray.800"
							_dark={{ borderColor: "gray.200" }}
						/>
					</Box>
					<Box
						gridColumn="span 8"
						p={8}
						width="full"
						height="full"
						borderRadius="lg"
						textAlign="left"
						mt={5}
					>
						<Text
							fontSize="3xl"
							fontWeight="bold"
							color="gray.800"
							_dark={{ color: "white" }}
						>
							{value?.[0].displayName}
						</Text>
						<Stack>
							<HStack
								spacing={3}
								color="gray.800"
								_dark={{ color: "gray.200" }}
							>
								<Text
									fontSize="lg"
									fontWeight="semi-bold"
									color="gray.800"
									_dark={{ color: "gray.200" }}
								>
									@{value?.[0].email?.split("@")[0]}
								</Text>
							</HStack>
							{value?.[0].bio && (
								<HStack
									spacing={3}
									color="gray.700"
									_dark={{ color: "gray.200" }}
									my={3}
								>
									<Text fontSize="medium">{value?.[0].bio}</Text>
								</HStack>
							)}
							<HStack
								spacing={3}
								color="gray.700"
								_dark={{ color: "gray.200" }}
							>
								<FiMapPin size={20} />
								<Text fontSize="medium">
									{value?.[0].location ?? "Some where in Earth"}
								</Text>
							</HStack>
							<HStack
								spacing={3}
								color="gray.700"
								_dark={{ color: "gray.200" }}
							>
								<FaEnvelope size={20} />
								<Text fontSize="medium">{value?.[0].email}</Text>
							</HStack>
							<HStack
								spacing={3}
								color="gray.700"
								_dark={{ color: "gray.200" }}
							>
								<GoCalendar size={20} />
								<Text fontSize="medium">
									Joined{" "}
									{dayjs(value?.[0].metadata?.creationTime).format("MMM YYYY")}
								</Text>
							</HStack>
						</Stack>
					</Box>
				</Flex>
			</Card>
			<VStack width="full" alignItems="flex-start" gap={2}>
				{values?.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet as Tweet} />
				))}
			</VStack>
		</>
	);
};

export default ProfilePage;
