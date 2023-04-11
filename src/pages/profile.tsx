import {
	Box,
	Card,
	Flex,
	HStack,
	Image,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";

import { useAuthState } from "react-firebase-hooks/auth";
import { FaEnvelope } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { auth, db } from "../../firebase";
import { GoCalendar } from "react-icons/go";
import { collection, doc, query, where } from "firebase/firestore";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import TweetCard from "@/components/ui/TweetCard";
import { Tweet } from ".";

const ProfilePage = () => {
	const [currentUser, userloading] = useAuthState(auth);
	const [value, bioLoading, bioError, snapshot] = useDocumentData(
		doc(db, "users", currentUser?.uid ?? "-"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
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
			<Card width={"full"} maxW={"3xl"} mb={3}>
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
							backgroundImage: "url(https://picsum.photos/200/300)",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
						height="100%"
						width="100%"
						borderRadius="lg"
						p={8}
						display="flex"
						alignItems="left"
					>
						<Image
							src={currentUser?.photoURL || "https://picsum.photos/200/300"}
							alt="Profile Picture"
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
								<Text fontSize="medium">Sinamangal, Kathmandu</Text>
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
									{currentUser?.metadata.creationTime}
								</Text>
							</HStack>
						</Stack>
					</Box>
				</Flex>
			</Card>
			<VStack width={"full"} alignItems={"flex-start"} gap={2}>
				{values?.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet as Tweet} />
				))}
			</VStack>
		</>
	);
};

export default ProfilePage;
