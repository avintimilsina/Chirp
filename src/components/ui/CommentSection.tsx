import { IComment } from "@/types/Comment";
import { EditIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardBody,
	Divider,
	Flex,
	HStack,
	Heading,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Stack,
	StackDivider,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
	collectionGroup,
	deleteDoc,
	doc,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BsThreeDotsVertical } from "react-icons/bs";
import { auth, db } from "../../../firebase";
import ConfirmationModal from "./ConfirmationModal";
import CreateComment from "./CreateComment";

// Used to display the time in relative time format (e.g. from now).
dayjs.extend(relativeTime);

interface CommentSectionProps {
	postId: string;
	setIsCommentCountOutdated?: (value: boolean) => void;
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
const CommentSection = ({
	postId,
	setIsCommentCountOutdated,
}: CommentSectionProps) => {
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
	useEffect(() => {
		if (typeof setIsCommentCountOutdated === "function" && !loading) {
			setIsCommentCountOutdated(true);
		}
	}, [setIsCommentCountOutdated, values, loading]);

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
							postId={postId}
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
	postId: string;
	comment: IComment;
}
const Comment = ({ comment, postId }: CommentProps) => {
	const [currentUser] = useAuthState(auth);
	const { isOpen, onOpen, onClose: modalOnClose } = useDisclosure();

	return (
		<HStack alignItems="flex-start">
			<Avatar
				name={comment.author.name}
				src={comment.author.photoURL}
				size="sm"
				// When the currentUser clicks on the avatar, it redirects to the commenter's profile page.
				as={Link}
				href={`/${comment.author.username}`}
			/>
			<Box w="full">
				<Flex justifyContent="space-between">
					<Stack
						divider={<Text>·</Text>}
						direction="row"
						alignItems="flex-start"
						gap="2"
					>
						{/* Displays the commenter's name and username and the time when the comment was posted. */}
						{/* When the currentUser clicks on the displayName or username, it redirects to the commenter's profile page. */}

						<Heading
							size="sm"
							as={Link}
							href={`/${comment.author.username}`}
							_hover={{ textDecoration: "none" }}
						>
							{comment.author.name}
						</Heading>
						<Text
							fontSize="sm"
							color="gray.500"
							as={Link}
							href={`/${comment.author.username}`}
							_hover={{ textDecoration: "none" }}
						>
							@{comment.author.username}
						</Text>
						<Text fontSize="sm" color="gray.500">
							{comment?.createdAt &&
								dayjs(comment.createdAt.seconds * 1000).fromNow()}
						</Text>
					</Stack>
					<Menu placement="start-start">
						<MenuButton>
							<BsThreeDotsVertical />
						</MenuButton>
						<MenuList p="0" m="0" minW="0" w="200px">
							{currentUser?.uid === comment.author.userId ? (
								<>
									<MenuItem
										as={Button}
										onClick={onOpen}
										p="0"
										variant="ghost"
										leftIcon={<EditIcon />}
									>
										Edit
										<Modal
											isOpen={isOpen}
											onClose={modalOnClose}
											size="xl"
											preserveScrollBarGap
										>
											<ModalOverlay />
											<ModalContent>
												<ModalHeader>
													<ModalCloseButton />
												</ModalHeader>

												<ModalBody>
													<CreateComment
														postId={postId}
														defaultValues={comment}
														modalOnClose={modalOnClose}
													/>
												</ModalBody>
											</ModalContent>
										</Modal>
									</MenuItem>
									<Divider />

									<MenuItem p="0" m="0">
										<ConfirmationModal
											onSuccess={async () => {
												await deleteDoc(
													doc(db, "chirps", postId, "comments", comment.id)
												);
											}}
											headerText="Delete Comment"
											bodyText="Are you sure you want to delete this comment?"
										/>
									</MenuItem>
								</>
							) : (
								<MenuItem
									as={Button}
									p="0"
									m="0"
									variant="ghost"
									leftIcon={<WarningTwoIcon />}
								>
									Report
								</MenuItem>
							)}
						</MenuList>
					</Menu>
				</Flex>
				<Text pt="2">{comment.content}</Text>

				{/* Comment posted time is formatted in the following format: HH:mm A · MMM D, YYYY(e.g. 12:00 PM · Jan 1, 2021) */}
				<Text pt="2" fontSize="sm" color="gray.500">
					{comment?.createdAt &&
						dayjs(comment.createdAt.seconds * 1000).format(
							"HH:mm A · MMM D, YYYY"
						)}
				</Text>
			</Box>
		</HStack>
	);
};

CommentSection.defaultProps = {
	setIsCommentCountOutdated: null,
};

export default CommentSection;
