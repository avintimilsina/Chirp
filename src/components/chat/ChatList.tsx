import {
	Avatar,
	Box,
	CardBody,
	Divider,
	Flex,
	HStack,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useChat } from "../contexts/ChatContext";

interface ChatListProps {
	photoURL: string;
	displayName: string;
	uid: string;
}

const ChatList = ({ photoURL, displayName, uid }: ChatListProps) => {
	const { setChat } = useChat();
	return (
		// here we are using the router.push method on the onClick function to redirect to the /?chatting={clickedUserId} route and pass in the id of the user that was clicked on.

		// this opens up the Chat component and displays the messages between the current user and the user that was clicked on.
		<Flex
			direction={{ base: "column", sm: "row" }}
			onClick={() => {
				// router.push(`?chatting=${uid}`);
				setChat(uid);
			}}
		>
			{/* Displaying information about all the users present in the database with displayName, photoURL and user id */}
			<Stack>
				<CardBody>
					<HStack>
						<Avatar src={photoURL} />
						<Box>
							<Heading size="md">{displayName}</Heading>

							<Text fontSize="xs">{uid}</Text>
						</Box>
					</HStack>
				</CardBody>
				<Divider />
			</Stack>
		</Flex>
	);
};

export default ChatList;
