import { Flex, Text } from "@chakra-ui/react";
import { useRef, useEffect } from "react";

interface MessageProps {
	messages: {
		from: string;
		text: string;
	}[];
}

const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => (elementRef as any)?.current?.scrollIntoView());
	return <div ref={elementRef as any} />;
};
const Messages = ({ messages }: MessageProps) => (
	<Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
		{messages.map((message) => (
			<Flex
				key={message.text}
				w="100%"
				justify={message.from === "me" ? "flex-start" : "flex-end"}
			>
				<Flex
					bg={message.from === "me" ? "blue.500" : "gray.100"}
					color={message.from === "me" ? "white" : "black"}
					minW="100px"
					maxW="350px"
					my="1"
					py="2"
					px="4"
					direction="column"
					borderRadius="12"
				>
					<Text fontWeight="bold">{message.from}</Text>
					<Text>{message.text}</Text>
				</Flex>
			</Flex>
		))}
		<AlwaysScrollToBottom />
	</Flex>
);

export default Messages;
