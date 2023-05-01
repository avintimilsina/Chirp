import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import CreateTweet from "@/components/ui/CreateTweet";
import TweetCard, { TweetCardSkeleton } from "@/components/ui/TweetCard";
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
	if (error) {
		return <PageLoadingSpinner />;
	}
	return (
		<Box width="full" maxW="xl">
			<CreateTweet />

			{loading ? (
				<VStack width="full" alignItems="flex-start" gap={2}>
					{Array(5)
						.fill("twitter-skeleton")
						.map((key, index) => (
							<TweetCardSkeleton key={`${key}-${index + 1}`} />
						))}
				</VStack>
			) : (
				<VStack width="full" alignItems="flex-start" gap={2}>
					{values?.map((tweet) => (
						<TweetCard key={tweet.id} tweet={tweet as Tweet} />
					))}
				</VStack>
			)}
		</Box>
	);
};

export default HomePage;
