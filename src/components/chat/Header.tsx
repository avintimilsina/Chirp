import { Flex, Text } from "@chakra-ui/react";

const Header = () => (
	<Flex w="100%">
		<Flex flexDirection="column" mx="5" justify="center">
			<Text fontSize="lg" fontWeight="bold">
				Sample Chat
			</Text>
		</Flex>
	</Flex>
);

export default Header;
