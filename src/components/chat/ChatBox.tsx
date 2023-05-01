import { Card, Spinner, VStack } from "@chakra-ui/react";
import { collection, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";
import { useChat } from "../contexts/ChatContext";
import Chat from "./Chat";
import ChatList, { ChatListSkeleton } from "./ChatList";
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
	if (chatting && !loading) {
		return (
			<Chat
				reciever={chatting as string}
				displayName={
					values?.filter((user) => user.uid === chatting)?.[0].displayName
				}
				photoURL={values?.filter((user) => user.uid === chatting)?.[0].photoURL}
			/>
		);
	}
	if (error) {
		return <Spinner />;
	}
	return (
		<VStack
			alignItems="flex-start"
			position="fixed"
			overflowY="scroll"
			top="0"
			right={{ base: "0", md: "44" }}
			minW="xs"
			h="100vh"
			as={Card}
		>
			<Search />
			{/* Passing information about all the users present in the database with displayName, photoURL and user id */}
			{loading
				? Array(5)
						.fill("chatList-skeleton")
						.map((key, index) => (
							<ChatListSkeleton key={`${key}-${index + 1}`} />
						))
				: values?.map((value) => {
						if (currentUser?.uid === value.uid) return null;
						return (
							<ChatList
								key={value.uid}
								displayName={value.displayName}
								photoURL={value.photoURL}
								uid={value.uid}
								currentUser={currentUser}
							/>
						);
				  })}
		</VStack>
	);
};

export default ChatBox;
