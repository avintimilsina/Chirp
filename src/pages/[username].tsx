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

import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import TweetCard from "@/components/ui/TweetCard";
import { Tweet } from "@/types/Tweet";
import dayjs from "dayjs";
import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
	collection,
	query,
	where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaEnvelope } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { GoCalendar } from "react-icons/go";
import { auth, db } from "../../firebase";
import NotFound from "./404";

//! Doesnot know how this converter works.
const postConverter: FirestoreDataConverter<Tweet> = {
	toFirestore(): DocumentData {
		return {};
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	): Tweet {
		const data = snapshot.data(options);
		return {
			id: snapshot.id,
			images: data.images,
			content: data.content,
			createdAt: data.createdAt,
			author: data.author,
		};
	},
};

const ProfilePage = () => {
	const router = useRouter();
	const { username } = router.query;
	const [, userloading] = useAuthState(auth);

	// This query is used to get the user from the users collection where the username of the user is equal to the username in the url.
	const [value] = useCollectionData(
		query(collection(db, "users"), where("username", "==", username ?? "-")),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	// This query is used to get all the posts from the chirps collection where the userId of the author of the post is equal to the userId of the user.
	//! Error is occuring in this query if a unregistered user tries to access the profile page.
	const [values, loading, error] = useCollectionData(
		query(
			collection(db, "chirps").withConverter(postConverter),
			where("author.userId", "==", value?.[0]?.uid ?? "-")
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
	// If the user does not exist then display the 404 page.
	if (value?.length === 0) {
		return <NotFound />;
	}
	return (
		<>
			{/* Displaying the profile page of currentUser if the username in the url is equal to the username of the currentUser. */}
			<Card width="full" maxW="xl" mb={3}>
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
							{/* If the user has bio then display the bio. */}
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
							{/* If the user has location then display the location. */}
							{value?.[0].location && (
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
							)}
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
			{/* Displays all the chirps created by the user. */}
			<VStack width="full" alignItems="flex-start" gap={2} maxW="xl">
				{values?.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet as Tweet} />
				))}
			</VStack>
		</>
	);
};

export default ProfilePage;
