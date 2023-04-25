import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import CommentSection from "@/components/ui/CommentSection";
import CreateComment from "@/components/ui/CreateComment";
import TweetCard from "@/components/ui/TweetCard";
import { Card, CardBody, VStack } from "@chakra-ui/react";
import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Tweet } from "..";
import { db } from "../../../firebase";

const PostPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const [value, chirpLoading, chirpError] = useDocumentData(
		doc(db, "chirps", (id as string) ?? "-"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (chirpLoading) {
		return <PageLoadingSpinner />;
	}
	if (chirpError) {
		return <PageLoadingSpinner />;
	}

	return (
		<VStack gap="2" align="left">
			<TweetCard tweet={{ ...value, id } as Tweet} />
			<Card maxW="3xl" width="full">
				<CardBody py="2">
					<CreateComment postId={id as string} />
				</CardBody>
			</Card>
			<CommentSection postId={id as string} />
		</VStack>
	);
};

export default PostPage;
