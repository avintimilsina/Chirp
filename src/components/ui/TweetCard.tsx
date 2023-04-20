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
	Text,
} from "@chakra-ui/react";
import {
	collection,
	deleteDoc,
	doc,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BiChat, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFeather } from "react-icons/fi";
import { auth, db } from "../../../firebase";

interface TweetCardProps {
	tweet: {
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
	};
}
const TweetCard = ({ tweet }: TweetCardProps) => {
	const [currentUser] = useAuthState(auth);
	const [value] = useCollectionData(
		query(collection(db, "feathers"), where("postId", "==", tweet.id)),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const userWhoLiked = value?.map((item) => item.userId);
	return (
		<Card maxW="3xl" width="full">
			<CardHeader>
				<Flex gap={4}>
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
							<Text>@{tweet.author.username}</Text>
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
			<CardBody py="0">
				<Text>{tweet.content}</Text>
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
			>
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
						if (userWhoLiked?.includes(currentUser?.uid)) {
							await deleteDoc(
								doc(db, "feathers", `${tweet.id}-${currentUser?.uid}`)
							);
						} else {
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
					{value?.length ? value.length : 0}
				</Button>
				<Button flex="1" variant="ghost" leftIcon={<BiChat />}>
					Comment
				</Button>
				<Button flex="1" variant="ghost" leftIcon={<BiShare />}>
					Share
				</Button>
			</CardFooter>
		</Card>
	);
};
export default TweetCard;
