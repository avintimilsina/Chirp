import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import CreateTweet from "@/components/ui/CreateTweet";
import TweetCard from "@/components/ui/TweetCard";
import { Tweet } from "@/types/Tweet";
import { Box, VStack } from "@chakra-ui/react";
import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
	collection,
	orderBy,
	query,
} from "firebase/firestore";
import { NextPage } from "next";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";

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
const HomePage: NextPage = () => {
	// This query will fetch all the chirps from the database and order the chirps according to their createdAt timestamp.
	const [values, loading, error] = useCollectionData(
		query(
			collection(db, "chirps").withConverter(postConverter),
			orderBy("createdAt", "desc")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}
	return (
		<Box width="full" maxW="2xl">
			<CreateTweet />
			<VStack width="full" alignItems="flex-start" gap={2}>
				{/* Displays all the chirps present in the database. */}
				{values?.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet as Tweet} />
				))}
			</VStack>
		</Box>
	);
};

export default HomePage;
