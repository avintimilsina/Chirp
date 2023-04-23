import { Box, Card, Flex, Spinner, VStack } from "@chakra-ui/react";
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
