import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import CommentSection from "@/components/ui/CommentSection";
import CreateComment from "@/components/ui/CreateComment";
import TweetCard, { TweetCardSkeleton } from "@/components/ui/TweetCard";
import { Tweet } from "@/types/Tweet";
import { Card, CardBody, VStack } from "@chakra-ui/react";
import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";

const PostPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const [isCommentCountOutdated, setIsCommentCountOutdated] = useState(false);
	const [value, chirpLoading, chirpError] = useDocumentData(
		doc(db, "chirps", (id as string) ?? "-"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (chirpError) {
		return <PageLoadingSpinner />;
	}

	return (
		<VStack gap="2" align="left" maxW="xl">
			{chirpLoading ? (
				<TweetCardSkeleton />
			) : (
				<TweetCard
					tweet={{ ...value, id } as Tweet}
					isCommentCountOutdated={isCommentCountOutdated}
					setIsCommentCountOutdated={setIsCommentCountOutdated}
				/>
			)}
			<Card maxW="3xl" width="full">
				<CardBody py="2">
					<CreateComment postId={id as string} />
				</CardBody>
			</Card>
			<CommentSection
				postId={id as string}
				setIsCommentCountOutdated={setIsCommentCountOutdated}
			/>
		</VStack>
	);
};

export default PostPage;
