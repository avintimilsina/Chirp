import { Flex, Text } from "@chakra-ui/react";
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
}

const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => (elementRef as any)?.current?.scrollIntoView());
	return <div ref={elementRef as any} />;
};
const Messages = ({ messages, currentUser }: MessageProps) => (
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
				justify={
					message.fromId !== currentUser?.uid ? "flex-start" : "flex-end"
				}
			>
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
					<Text fontWeight="bold">{message.fromId}</Text>
					<Text>{message.text}</Text>
				</Flex>
			</Flex>
		))}
		<AlwaysScrollToBottom />
	</Flex>
);

export default Messages;
