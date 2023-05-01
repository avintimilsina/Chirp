import {
	Avatar,
	Box,
	CardBody,
	Divider,
	Flex,
	HStack,
	Heading,
	Skeleton,
	SkeletonCircle,
	Stack,
	Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { User } from "firebase/auth";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import { useChat } from "../contexts/ChatContext";
import relationGenerator from "../helpers/relationGenerator";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s",
		s: "a few seconds",
		m: "1 min",
		mm: "%d min",
		h: "1 h",
		hh: "%d h",
		d: "1 day",
		dd: "%d d",
		M: "1 month",
		MM: "%d months",
		y: "1 y",
		yy: "%d y",
	},
});
interface ChatListProps {
	photoURL: string;
	displayName: string;
	uid: string;
	currentUser: User | null | undefined;
}

const ChatList = ({
	photoURL,
	displayName,
	uid,
	currentUser,
}: ChatListProps) => {
	const { setChat } = useChat();
	const [lastChat, loading, error] = useCollectionData(
		query(
			collection(db, "chats"),
			where("relation", "==", relationGenerator(currentUser?.uid ?? "-", uid)),
			orderBy("createdAt", "desc"),
			limit(1)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	if (error) {
		return <div>{error.message}</div>;
	}
	return (
		// here we are using the router.push method on the onClick function to redirect to the /?chatting={clickedUserId} route and pass in the id of the user that was clicked on.

		// this opens up the Chat component and displays the messages between the current user and the user that was clicked on.
		<Flex
			direction={{ base: "column", sm: "row" }}
			onClick={() => {
				setChat(uid);
			}}
			w="full"
		>
			{/* Displaying information about all the users present in the database with displayName, photoURL and user id */}
			<Stack w="full">
				<CardBody py="2">
					<HStack>
						<Avatar src={photoURL} />
						<Box>
							<Heading size="md">{displayName}</Heading>
							{loading ? (
								<Skeleton h="12px" w="full" my="1" />
							) : (
								<Text fontSize="xs">
									{lastChat?.length
										? `${lastChat?.[0].text} · ${
												lastChat?.[0].createdAt &&
												dayjs(
													(lastChat?.[0].createdAt.seconds as number) * 1000
												).fromNow()
										  }`
										: "Say Hi!👋"}
								</Text>
							)}
						</Box>
					</HStack>
				</CardBody>
				<Divider />
			</Stack>
		</Flex>
	);
};

export default ChatList;

export const ChatListSkeleton = () => (
	<Flex direction={{ base: "column", sm: "row" }} w="full">
		<Stack w="full">
			<CardBody py="2">
				<HStack>
					<SkeletonCircle size="48px" />
					<Box>
						<Skeleton>
							<Heading size="md">Avin Timilsina</Heading>
						</Skeleton>

						<Skeleton h="12px" w="full" my="1" />
					</Box>
				</HStack>
			</CardBody>
			<Divider />
		</Stack>
	</Flex>
);
