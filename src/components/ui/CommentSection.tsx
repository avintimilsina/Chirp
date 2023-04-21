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

dayjs.extend(relativeTime);

interface CommentSectionProps {
	postId: string;
}
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
			name="Avin"
			src={comment.author.photoURL}
			size="sm"
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
				<Heading
					size="sm"
					textTransform="uppercase"
					as={Link}
					href={`/${comment.author.username}`}
				>
					{comment.author.name}
				</Heading>
				<Text
					fontSize="sm"
					color="blackAlpha.700"
					as={Link}
					href={`/${comment.author.username}`}
				>
					@{comment.author.username}
				</Text>
				<Text fontSize="sm" color="blackAlpha.700">
					{comment?.createdAt &&
						dayjs(comment.createdAt.seconds * 1000).fromNow()}
				</Text>
			</Stack>
			<Text pt="2">{comment.content}</Text>
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
