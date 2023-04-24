import { Box, Card, Flex, Spinner, VStack } from "@chakra-ui/react";
import { collection, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import Chat from "./Chat";
import ChatList from "./ChatList";

const ChatBox = () => {
	const router = useRouter();

	// gets all the users from the users collection using the useCollectionData hook.
	const [values, loading, error] = useCollectionData(
		query(collection(db, "users")),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	// if the currentUser clicks on a user in the ChatList component, it will redirect to the /?chatting={clickedUserId} route and pass in the id of the user that was clicked on.
	if (router.query.chatting) {
		return <Chat reciever={router.query.chatting as string} />;
	}
	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <Spinner />;
	}
	return (
		<Flex
			as={Card}
			p="2"
			h="100vh"
			justify="center"
			align="center"
			position="fixed"
			top="0"
			right="0"
			borderLeftRadius="xl"
		>
			<VStack gap="1">
				<Box>
					{/* Passing information about all the users present in the database with displayName, photoURL and user id */}
					{values?.map((value) => (
						<ChatList
							displayName={value.displayName}
							photoURL={value.photoURL}
							uid={value.uid}
						/>
					))}
				</Box>
			</VStack>
		</Flex>
	);
};

export default ChatBox;
