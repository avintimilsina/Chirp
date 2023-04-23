import { VStack } from "@chakra-ui/react";
import { collection, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import Chat from "./Chat";
import ChatList from "./ChatList";

const ChatBox = () => {
	const router = useRouter();
	const [values, loading, error] = useCollectionData(
		query(collection(db, "users")),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (router.query.chatting) {
		return <Chat reciever={router.query.chatting as string} />;
	}
	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error...</div>;
	}
	return (
		<VStack>
			{values?.map((value) => (
				<ChatList
					displayName={value.displayName}
					photoURL={value.photoURL}
					uid={value.uid}
				/>
			))}
		</VStack>
	);
};

export default ChatBox;
