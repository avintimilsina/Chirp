import {
	Avatar,
	Box,
	Card,
	Flex,
	HStack,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";

import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import TweetCard from "@/components/ui/TweetCard";
import { collection, doc, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import { FaEnvelope } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { GoCalendar } from "react-icons/go";
import dayjs from "dayjs";
import { Tweet } from ".";
import { auth, db } from "../../firebase";

const ProfilePage = () => {
	const [currentUser, userloading] = useAuthState(auth);
	const [value] = useDocumentData(doc(db, "users", currentUser?.uid ?? "-"), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const [values, loading, error] = useCollectionData(
		query(
			collection(db, "chirps"),
			where("author.userId", "==", currentUser?.uid ?? "-")
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
								value?.coverPhoto || "https://picsum.photos/200/300"
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
							src={currentUser?.photoURL || "https://picsum.photos/200/300"}
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
							{currentUser?.displayName}
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
									@{currentUser?.email?.split("@")[0]}
								</Text>
							</HStack>
							{value?.bio && (
								<HStack
									spacing={3}
									color="gray.700"
									_dark={{ color: "gray.200" }}
									my={3}
								>
									<Text fontSize="medium">{value.bio}</Text>
								</HStack>
							)}
							<HStack
								spacing={3}
								color="gray.700"
								_dark={{ color: "gray.200" }}
							>
								<FiMapPin size={20} />
								<Text fontSize="medium">
									{value?.location ?? "Some where in Earth"}
								</Text>
							</HStack>
							<HStack
								spacing={3}
								color="gray.700"
								_dark={{ color: "gray.200" }}
							>
								<FaEnvelope size={20} />
								<Text fontSize="medium">{currentUser?.email}</Text>
							</HStack>
							<HStack
								spacing={3}
								color="gray.700"
								_dark={{ color: "gray.200" }}
							>
								<GoCalendar size={20} />
								<Text fontSize="medium">
									Joined{" "}
									{dayjs(currentUser?.metadata.creationTime).format("MMM YYYY")}
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
