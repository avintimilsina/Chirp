import { Avatar, Flex, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";
import { useEffect, useRef } from "react";

// Here the messages prop is passed in from the Chat component.
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

// This component is used to scroll to the bottom of the messages to see the latest message.
// No idea how it works, but it works when I copied it.
// Have no idea about useRef hook.
//! But it seems it is not working properly.
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
		{/* It maps through the array of messages between the currentUser and the reciever */}

		{/* If the message is from the currentUser, then display the message on the right side of the chat box and If the message is from the reciever, then display the message on the left side of the chat box using ternary operator in the justify attribute */}
		{messages.map((message) => (
			<Flex
				key={message.text}
				w="100%"
				alignItems="center"
				justify={
					message.fromId !== currentUser?.uid ? "flex-start" : "flex-end"
				}
			>
				{/* This displays only the avatar of the reciever and not of currentUser since fromId is always of currentUser  */}
				{message.fromId !== currentUser?.uid && (
					<Avatar
						mr="1"
						src={recieverValue?.photoURL ?? "https://picsum.photos/200/300"}
						size="sm"
					/>
				)}
				{/* If the message is from the currentUser, then display the message as blue and If the message is from the reciever, then display the message as grey */}
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
					{/* !IMP word break is not working and the size of the window changes if a long message is typed */}
					<Text wordBreak={message.text.length > 5 ? "break-all" : "normal"}>
						{message.text}
					</Text>
				</Flex>
			</Flex>
		))}
		<AlwaysScrollToBottom />
	</Flex>
);

export default Messages;
