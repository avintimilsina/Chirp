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
import { useRouter } from "next/router";

interface ChatListProps {
	photoURL: string;
	displayName: string;
	uid: string;
}

const ChatList = ({ photoURL, displayName, uid }: ChatListProps) => {
	const router = useRouter();
	return (
		<Flex
			direction={{ base: "column", sm: "row" }}
			maxW="sm"
			onClick={() => {
				router.push(`?chatting=${uid}`);
			}}
		>
			<Stack>
				<CardBody>
					<HStack>
						<Avatar
							maxW={{ base: "100%", sm: "200px" }}
							src={photoURL ?? "https://picsum.photos/200/300"}
						/>
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
