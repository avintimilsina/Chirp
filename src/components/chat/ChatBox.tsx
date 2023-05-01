import { Card, Flex, Spinner, VStack } from "@chakra-ui/react";
import { collection, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";
import { useChat } from "../contexts/ChatContext";
import Chat from "./Chat";
import ChatList from "./ChatList";
import Search from "./Search";

const ChatBox = () => {
	const [currentUser] = useAuthState(auth);
	const { chatting } = useChat();
	// gets all the users from the users collection using the useCollectionData hook.
	const [values, loading, error] = useCollectionData(
		query(collection(db, "users")),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	// if the currentUser clicks on a user in the ChatList component, it will redirect to the /?chatting={clickedUserId} route and pass in the id of the user that was clicked on.
	if (chatting) {
		return <Chat reciever={chatting as string} />;
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
				<Search />
				{/* Passing information about all the users present in the database with displayName, photoURL and user id */}

				{values?.map((value) => {
					if (currentUser?.uid === value.uid) return null;
					return (
						<ChatList
							key={value.uid}
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
