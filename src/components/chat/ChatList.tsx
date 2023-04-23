import {
	Avatar,
	Box,
	Card,
	CardBody,
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
		<Card
			direction={{ base: "column", sm: "row" }}
			variant="outline"
			maxW="xl"
			onClick={() => {
				router.push(`?chatting=${uid}`);
			}}
		>
			<Stack>
				<CardBody>
					<HStack>
						<Avatar
							objectFit="cover"
							maxW={{ base: "100%", sm: "200px" }}
							src={photoURL ?? "https://picsum.photos/200/300"}
						/>
						<Box>
							<Heading size="md">{displayName}</Heading>

							<Text fontSize="sm">{uid}</Text>
						</Box>
					</HStack>
				</CardBody>
			</Stack>
		</Card>
	);
};

export default ChatList;
