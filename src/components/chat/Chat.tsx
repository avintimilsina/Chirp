import { Avatar, Card, Flex, Spinner, Text } from "@chakra-ui/react";
import {
	addDoc,
	collection,
	doc,
	orderBy,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";
import relationGenerator from "../helpers/relationGenerator";
import Divider from "./Divider";
import Footer from "./Footer";
import Messages from "./Messages";

interface ChatProps {
	reciever: string;
}

const Chat = ({ reciever }: ChatProps) => {
	const [currentUser] = useAuthState(auth);
	const [values, loading, error] = useCollectionData(
		query(
			collection(db, "chats"),
			where(
				"relation",
				"==",
				relationGenerator(currentUser?.uid ?? "-", reciever)
			),
			orderBy("createdAt", "desc")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [recieverValue, recieverLoading, recieverError] = useDocumentData(
		doc(db, "users", reciever ?? "-"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [inputMessage, setInputMessage] = useState("");

	const handleSendMessage = async () => {
		if (currentUser?.uid) {
			await addDoc(collection(db, "chats"), {
				fromId: currentUser?.uid,
				toId: reciever,
				text: inputMessage,
				createdAt: serverTimestamp(),
				from: doc(db, "users", currentUser?.uid),
				to: doc(db, "users", reciever),
				relation: relationGenerator(currentUser?.uid, reciever),
			});
		}
		if (inputMessage) {
			setInputMessage("");
		}
	};
	if (loading || recieverLoading) {
		return <Spinner />;
	}
	if (error || recieverError) {
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
			<Flex w="100%" flexDir="column">
				<Flex w="100%">
					<Flex flexDirection="row" mx="3" justify="center" alignItems="center">
						<Avatar
							mr="2"
							src={recieverValue?.photoURL ?? "https://picsum.photos/200/300"}
						/>
						<Text fontSize="lg" fontWeight="bold">
							{recieverValue?.displayName}
						</Text>
					</Flex>
				</Flex>
				<Divider />
				<Messages
					messages={values as any}
					currentUser={currentUser}
					recieverValue={{
						photoURL: recieverValue?.photoURL,
						displayName: recieverValue?.displayName,
					}}
				/>
				<Divider />
				<Footer
					inputMessage={inputMessage}
					setInputMessage={setInputMessage}
					handleSendMessage={handleSendMessage}
				/>
			</Flex>
		</Flex>
	);
};

export default Chat;
