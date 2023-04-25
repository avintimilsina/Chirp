import {
	Avatar,
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	Heading,
	Icon,
	IconButton,
	Spinner,
	Text,
	useClipboard,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import {
	collection,
	collectionGroup,
	deleteDoc,
	doc,
	getCountFromServer,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BiChat, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFeather } from "react-icons/fi";
import { auth, db } from "../../../firebase";

// This recieves the tweet object from the CreateTweet component.
interface TweetCardProps {
	tweet: {
		id: string;
		// images: string[];
		content: string;
		createdAt: { nanoseconds: number; seconds: number };
		author: {
			userId: string;
			name: string;
			photoURL: string;
			username: string;
		};
	};
}
const TweetCard = ({ tweet }: TweetCardProps) => {
	const { onCopy, setValue: setCopiedURL, hasCopied } = useClipboard("");
	const [currentUser] = useAuthState(auth);
	// Counts the number of comments on a chirp.
	const [commentCount, setCommentCount] = useState(0);
	const [commentLoading, setCommentLoading] = useState(true);
	const router = useRouter();
	// This query is used to get all the feathers from the feathers collection where the postId of the feather is equal to the postId of the post or chirp.
	const [value, valueLoading] = useCollectionData(
		query(
			collection(db, "feathers"),
			where("postId", "==", (tweet.id as string) ?? "-")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	// This is used to check if the current user has already feathered the chirp or not.
	// If the current user has already feathered the chirp then the feather button will glow blue else is grey.
	const userWhoLiked = value?.map((item) => item.userId);
	useEffect(() => {
		const callThisNow = async () => {
			// This query is used to get the number of comments on a chirp.
			const snapshot = await getCountFromServer(
				query(
					collectionGroup(db, "comments"),
					where("postId", "==", (tweet.id as string) ?? "-")
				)
			);
			setCommentCount(snapshot.data().count);
			setCommentLoading(false);
			setCopiedURL(`https://chirpyy.vercel.app/post/${tweet.id}`);
		};
		callThisNow();
	}, [setCopiedURL, tweet.id]);

	return (
		<Card maxW="3xl" width="full">
			<CardHeader>
				<Flex gap={4}>
					{/* Opens up the profile page of the user who created the chirp when clicked on the avatar, displayName or the username */}
					<Flex
						as={Link}
						href={`/${tweet.author.username}`}
						flex="1"
						gap="4"
						alignItems="center"
						flexWrap="wrap"
					>
						<Avatar name={tweet.author.name} src={tweet.author.photoURL} />

						<Box>
							<Heading size="sm">{tweet.author.name}</Heading>
							<Text color="gray.500">@{tweet.author.username}</Text>
						</Box>
					</Flex>
					<IconButton
						variant="ghost"
						colorScheme="gray"
						aria-label="See menu"
						icon={<BsThreeDotsVertical />}
					/>
				</Flex>
			</CardHeader>
			{/* Opens up the individual chirp page when the user clicks on the chirp to view and add comments */}

			<CardBody py="0" as={Link} legacyBehavior href={`/post/${tweet.id}`}>
				<Box px="6" mb="4">
					<Text mb="4">{tweet.content}</Text>
					{router.pathname === "/post/[id]" && (
						<Text fontSize="smaller" color="gray.500" p="0">
							{tweet?.createdAt &&
								dayjs(tweet.createdAt.seconds * 1000).format(
									"HH:mm A · MMM D, YYYY"
								)}
						</Text>
					)}
				</Box>
			</CardBody>
			{/* <Image
				objectFit="cover"
				src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
				alt="Chakra UI"
			/> */}

			<CardFooter
				justify="space-between"
				flexWrap="wrap"
				sx={{
					"& > button": {
						minW: "136px",
					},
				}}
				pt="0"
				p="4"
			>
				{valueLoading ? (
					<Button flex="1" variant="ghost">
						<Spinner size="sm" />
					</Button>
				) : (
					<Button
						flex="1"
						variant="ghost"
						leftIcon={
							<Icon
								as={FiFeather}
								color={
									userWhoLiked?.includes(currentUser?.uid)
										? "blue.500"
										: "gray.500"
								}
							/>
						}
						onClick={async () => {
							// Deletes the feather from the feathers collection if the current user has already feathered the chirp.
							if (userWhoLiked?.includes(currentUser?.uid)) {
								await deleteDoc(
									doc(db, "feathers", `${tweet.id}-${currentUser?.uid}`)
								);
							} else {
								// Sets the feather in the feathers collection if the current user has not already feathered the chirp.
								await setDoc(
									doc(db, "feathers", `${tweet.id}-${currentUser?.uid}`),
									{
										postId: tweet.id,
										userId: currentUser?.uid,
									}
								);
							}
						}}
					>
						{/* Displays the feathers count on the chirp. */}
						{value?.length ? value.length : 0}
					</Button>
				)}
				{commentLoading ? (
					<Button flex="1" variant="ghost">
						<Spinner size="sm" />
					</Button>
				) : (
					<Button
						flex="1"
						variant="ghost"
						leftIcon={<BiChat />}
						onClick={() => {
							router.push(`/post/${tweet.id}`);
						}}
					>
						{commentCount}
					</Button>
				)}

				<Button
					flex="1"
					variant="ghost"
					leftIcon={<BiShare />}
					onClick={() => {
						onCopy();
					}}
				>
					{hasCopied ? "Copied!" : "Share"}
				</Button>
			</CardFooter>
		</Card>
	);
};
export default TweetCard;
