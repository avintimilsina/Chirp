import CommentSection from "@/components/ui/CommentSection";
import CreateComment from "@/components/ui/CreateComment";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
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
	Icon,
	IconButton,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import {
	collection,
	deleteDoc,
	doc,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import { BiChat, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFeather } from "react-icons/fi";
import { auth, db } from "../../../firebase";

const PostPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const [currentUser] = useAuthState(auth);
	const [value, chirpLoading, chirpError] = useDocumentData(
		doc(db, "chirps", (id as string) ?? "-"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [feathers, featherLoading] = useCollectionData(
		query(
			collection(db, "feathers"),
			where("postId", "==", (id as string) ?? "-")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const userWhoLiked = feathers?.map((item) => item.userId);
	if (chirpLoading) {
		return <PageLoadingSpinner />;
	}
	if (chirpError) {
		return <PageLoadingSpinner />;
	}

	return (
		<VStack gap="2" align="left">
			<Card maxW="3xl" width="full">
				<CardHeader>
					<Flex gap={4}>
						<Flex
							as={Link}
							href={`/${value?.author.username}`}
							flex="1"
							gap="4"
							alignItems="center"
							flexWrap="wrap"
						>
							<Avatar name={value?.author.name} src={value?.author.photoURL} />

							<Box>
								<Heading size="sm">{value?.author.name}</Heading>
								<Text>@{value?.author.username}</Text>
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
					<Text>{value?.content}</Text>
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
					{featherLoading ? (
						<Button flex="1" variant="ghost">
							<Spinner size="sm" />
						</Button>
					) : (
						<Button
							flex="1"
							variant="ghost"
							leftIcon={
								<Icon
									as={FiFeather}
									color={
										userWhoLiked?.includes(currentUser?.uid)
											? "blue.500"
											: "gray.500"
									}
								/>
							}
							onClick={async () => {
								if (userWhoLiked?.includes(currentUser?.uid)) {
									await deleteDoc(
										doc(db, "feathers", `${id}-${currentUser?.uid}`)
									);
								} else {
									await setDoc(
										doc(db, "feathers", `${id}-${currentUser?.uid}`),
										{
											postId: id,
											userId: currentUser?.uid,
										}
									);
								}
							}}
						>
							{feathers?.length ? feathers.length : 0}
						</Button>
					)}
					<Button flex="1" variant="ghost" leftIcon={<BiChat />}>
						Comment
					</Button>
					<Button flex="1" variant="ghost" leftIcon={<BiShare />}>
						Share
					</Button>
				</CardFooter>
			</Card>
			<Card maxW="3xl" width="full">
				<CardBody py="2">
					<CreateComment postId={id as string} />
				</CardBody>
			</Card>
			<CommentSection postId={id as string} />
		</VStack>
	);
};

export default PostPage;
