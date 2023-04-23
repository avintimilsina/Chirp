import { Avatar, Flex, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";
import { useEffect, useRef } from "react";

export interface MessageProps {
	messages: {
		createdAt: { seconds: number; nanoseconds: number };
		from: DocumentReference;
		fromId: string;
		relation: string;
		text: string;
		to: DocumentReference;
		toId: string;
	}[];
	currentUser: User | null | undefined;
	recieverValue: {
		photoURL: string;
		displayName: string;
	};
}

const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => (elementRef as any)?.current?.scrollIntoView());
	return <div ref={elementRef as any} />;
};
const Messages = ({ messages, currentUser, recieverValue }: MessageProps) => (
	<Flex
		w="100%"
		h="80%"
		overflowY="scroll"
		flexDirection="column-reverse"
		p="3"
	>
		{messages.map((message) => (
			<Flex
				key={message.text}
				w="100%"
				alignItems="center"
				justify={
					message.fromId !== currentUser?.uid ? "flex-start" : "flex-end"
				}
			>
				<Avatar
					mr="1"
					src={
						message.fromId === currentUser?.uid
							? //! remove currentUser?.photo to see the other user's avatar
							  currentUser.photoURL ?? "https://picsum.photos/200/300"
							: recieverValue?.photoURL ?? "https://picsum.photos/200/300"
					}
					size="sm"
				/>
				<Flex
					bg={message.fromId === currentUser?.uid ? "blue.500" : "gray.100"}
					color={message.fromId === currentUser?.uid ? "white" : "black"}
					minW="100px"
					maxW="350px"
					my="1"
					py="2"
					px="4"
					direction="column"
					borderRadius="12"
				>
					{/* <Text fontWeight="bold">
						{message.fromId === currentUser?.uid
							? currentUser.displayName
							: recieverValue.displayName}
					</Text> */}
					<Text>{message.text}</Text>
				</Flex>
			</Flex>
		))}
		<AlwaysScrollToBottom />
	</Flex>
);

export default Messages;
