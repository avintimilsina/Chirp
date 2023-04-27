import { Card, Flex, Spinner, VStack } from "@chakra-ui/react";
import { collection, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";
import Chat from "./Chat";
import ChatList from "./ChatList";

const ChatBox = () => {
	const router = useRouter();
	const [currentUser] = useAuthState(auth);

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
		<Flex borderRadius="xl" transition="3s ease" w={{ base: "full", md: "60" }}>
			<VStack
				alignItems="flex-start"
				position="fixed"
				overflowY="scroll"
				top="0"
				right={{ base: "0", md: "44" }}
				maxWidth="xs"
				minW="xs"
				h="100vh"
				as={Card}
			>
				{/* Passing information about all the users present in the database with displayName, photoURL and user id */}
				{values?.map((value) => {
					if (currentUser?.uid === value.uid) return null;
					return (
						<ChatList
							displayName={value.displayName}
							photoURL={value.photoURL}
							uid={value.uid}
						/>
					);
				})}
			</VStack>
		</Flex>
	);
};

export default ChatBox;
