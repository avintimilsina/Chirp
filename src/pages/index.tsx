import CreateTweet from "@/components/ui/CreateTweet";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import TweetCard from "@/components/ui/TweetCard";
import { Box, VStack } from "@chakra-ui/react";
import { collection, orderBy, query } from "firebase/firestore";
import { NextPage } from "next";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";

export interface Tweet {
	id: string;
	images: string[];
	content: string;
	createdAt: string;
	author: {
		userId: string;
		name: string;
		photoURL: string;
		username: string;
	};
}
const HomePage: NextPage = () => {
	const [values, loading, error] = useCollectionData(
		query(collection(db, "chirps"), orderBy("createdAt", "desc")),
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
				{values?.map((tweet) => (
					<TweetCard key={tweet.id} tweet={tweet as Tweet} />
				))}
			</VStack>
		</Box>
	);
};

export default HomePage;
