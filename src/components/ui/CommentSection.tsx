import { Link } from "@chakra-ui/next-js";
import {
	Avatar,
	Box,
	Card,
	CardBody,
	HStack,
	Heading,
	Spinner,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
	collectionGroup,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";

// Used to display the time in relative time format (e.g. from now).
dayjs.extend(relativeTime);

interface CommentSectionProps {
	postId: string;
}
//! Doesnot know how this works.
const commentConverter: FirestoreDataConverter<CommentProps["comment"]> = {
	toFirestore(): DocumentData {
		return {};
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	): CommentProps["comment"] {
		const data = snapshot.data(options);
		return {
			id: snapshot.id,
			content: data.content,
			createdAt: data.createdAt,
			author: data.author,
		};
	},
};

// This query is used to get all the comments from the comments collection inside the chirps collection where the postId of the comment is equal to the postId of the post or chirp.
// Then it orders the comments by the createdAt field in descending order.
const CommentSection = ({ postId }: CommentSectionProps) => {
	const [values, loading, error] = useCollectionData(
		query(
			collectionGroup(db, "comments").withConverter(commentConverter),
			where("postId", "==", postId),
			orderBy("createdAt", "desc")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <Spinner />;
	}
	if (!loading && values?.length === 0) {
		return <p />;
	}
	return (
		<Card maxW="3xl" width="full">
			<CardBody>
				<Stack divider={<StackDivider />} spacing="4">
					{values?.map((comment) => (
						// Displays all the comments of the post.
						<Comment
							key={comment.id}
							comment={{
								id: comment.id,
								content: comment.content,
								createdAt: comment.createdAt,
								author: {
									userId: comment.author.userId,
									name: comment.author.name,
									photoURL: comment.author.photoURL,
									username: comment.author.username,
								},
							}}
						/>
					))}
				</Stack>
			</CardBody>
		</Card>
	);
};
interface CommentProps {
	comment: {
		id: string;
		content: string;
		createdAt: { seconds: number; nanoseconds: number };
		author: {
			userId: string;
			name: string;
			photoURL: string;
			username: string;
		};
	};
}
const Comment = ({ comment }: CommentProps) => (
	<HStack alignItems="flex-start">
		<Avatar
			name={comment.author.name}
			src={comment.author.photoURL}
			size="sm"
			// When the currentUser clicks on the avatar, it redirects to the commenter's profile page.
			as={Link}
			href={`/${comment.author.username}`}
		/>
		<Box>
			<Stack
				divider={<Text>·</Text>}
				direction="row"
				alignItems="center"
				gap="2"
			>
				{/* Displays the commenter's name and username and the time when the comment was posted. */}
				{/* When the currentUser clicks on the displayName or username, it redirects to the commenter's profile page. */}

				<Heading
					size="sm"
					textTransform="uppercase"
					as={Link}
					href={`/${comment.author.username}`}
					style={{ textDecoration: "none" }}
				>
					{comment.author.name}
				</Heading>
				<Text
					fontSize="sm"
					color="blackAlpha.700"
					as={Link}
					href={`/${comment.author.username}`}
					style={{ textDecoration: "none" }}
				>
					@{comment.author.username}
				</Text>
				<Text fontSize="sm" color="blackAlpha.700">
					{comment?.createdAt &&
						dayjs(comment.createdAt.seconds * 1000).fromNow()}
				</Text>
			</Stack>
			<Text pt="2">{comment.content}</Text>

			{/* Comment posted time is formatted in the following format: HH:mm A · MMM D, YYYY(e.g. 12:00 PM · Jan 1, 2021) */}
			<Text pt="2" fontSize="sm" color="blackAlpha.700">
				{comment?.createdAt &&
					dayjs(comment.createdAt.seconds * 1000).format(
						"HH:mm A · MMM D, YYYY"
					)}
			</Text>
		</Box>
	</HStack>
);

export default CommentSection;
