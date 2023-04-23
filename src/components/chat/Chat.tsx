import { Card, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Divider from "./Divider";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

const Chat = () => {
	const [messages, setMessages] = useState([
		{ from: "computer", text: "Hi, My Name is HoneyChat" },
		{ from: "me", text: "Hey there" },
		{ from: "me", text: "Myself Ferin Patel" },
		{
			from: "computer",
			text: "Nice to meet you. You can send me message and i'll reply you with same message.",
		},
	]);
	const [inputMessage, setInputMessage] = useState("");

	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		const data = inputMessage;

		setMessages((old) => [...old, { from: "me", text: data }]);
		setInputMessage("");

		setTimeout(() => {
			setMessages((old) => [...old, { from: "computer", text: data }]);
		}, 1000);
	};

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
			<Flex w="100%" h="90%" flexDir="column">
				<Header />
				<Divider />
				<Messages messages={messages} />
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
