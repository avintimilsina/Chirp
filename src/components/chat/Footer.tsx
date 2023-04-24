import { Flex, Input, IconButton } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";

interface FooterProps {
	inputMessage: string;
	setInputMessage: (value: string) => void;
	handleSendMessage: () => void;
}

const Footer = ({
	inputMessage,
	setInputMessage,
	handleSendMessage,
}: FooterProps) => (
	<Flex w="100%" mt="5" p="3">
		<Input
			mr="3"
			placeholder="Type Something..."
			borderWidth="1"
			borderColor="blue.100"
			borderRadius="50"
			_focus={{
				borderColor: "blue.500",
			}}
			// If the user presses the "enter" key, then the handleSendMessage function is called
			onKeyPress={(e) => {
				if (e.key === "Enter") {
					handleSendMessage();
				}
			}}
			value={inputMessage}
			onChange={(e) => setInputMessage(e.target.value)}
		/>
		<IconButton
			aria-label="Send Message"
			bg="blue.500"
			color="white"
			borderRadius="50%"
			_hover={{
				bg: "blue.700",
			}}
			icon={<ArrowRightIcon />}
			// If the inputMessage is empty, then the send button is disabled
			disabled={inputMessage.trim().length <= 0}
			onClick={handleSendMessage}
		/>
	</Flex>
);

export default Footer;
