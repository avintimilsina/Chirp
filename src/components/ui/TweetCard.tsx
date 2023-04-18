import {
	Avatar,
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	Heading,
	IconButton,
	Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { BiChat, BiLike, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

interface TweetCardProps {
	tweet: {
		id: string;
		images: string[];
		content: string;
		createdAt: string;
		author: {
			userId: string;
			name: string;
			photoURL: string;
			username: string;
		};
	};
}
const TweetCard = ({ tweet }: TweetCardProps) => (
	<Card maxW="3xl" width="full">
		<CardHeader>
			<Flex gap={4}>
				<Flex
					as={Link}
					href={`/${tweet.author.username}`}
					flex="1"
					gap="4"
					alignItems="center"
					flexWrap="wrap"
				>
					<Avatar name={tweet.author.name} src={tweet.author.photoURL} />

					<Box>
						<Heading size="sm">{tweet.author.name}</Heading>
						<Text>@{tweet.author.username}</Text>
					</Box>
				</Flex>
				<IconButton
					variant="ghost"
					colorScheme="gray"
					aria-label="See menu"
					icon={<BsThreeDotsVertical />}
				/>
			</Flex>
		</CardHeader>
		<CardBody py="0">
			<Text>{tweet.content}</Text>
		</CardBody>
		{/* <Image
				objectFit="cover"
				src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
				alt="Chakra UI"
			/> */}

		<CardFooter
			justify="space-between"
			flexWrap="wrap"
			sx={{
				"& > button": {
					minW: "136px",
				},
			}}
		>
			<Button flex="1" variant="ghost" leftIcon={<BiLike />}>
				Like
			</Button>
			<Button flex="1" variant="ghost" leftIcon={<BiChat />}>
				Comment
			</Button>
			<Button flex="1" variant="ghost" leftIcon={<BiShare />}>
				Share
			</Button>
		</CardFooter>
	</Card>
);

export default TweetCard;
