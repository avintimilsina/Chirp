import { ChatIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import {
	Avatar,
	Box,
	BoxProps,
	Button,
	CloseButton,
	Drawer,
	DrawerContent,
	Flex,
	FlexProps,
	HStack,
	Icon,
	IconButton,
	LinkProps,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Skeleton,
	SkeletonCircle,
	Spacer,
	Text,
	VStack,
	useColorModeValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { IconType } from "react-icons";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaRegPaperPlane } from "react-icons/fa";
import { FiHome, FiMenu } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { auth } from "../../../firebase";
import ChatBox from "../chat/ChatBox";
import Logo from "../logo";
import ThemeSelector from "../shared/ThemeSelector";
import CreateTweet from "./CreateTweet";

// This is the sidebar that shows up on the left side of the screen.
// It contains the logo, the links to the home page and the account settings page, and the user's profile picture.
// It also contains the "Chirp" button.
// This sidebar is copied from the Chakra UI templates.
interface LinkItemProps {
	name: string;
	icon: IconType;
	href: string;
}
// Passing the links icons and names as props of the pages as children.
const LinkItems: Array<LinkItemProps> = [
	{ name: "Home", icon: FiHome, href: "/" },
	{ name: "Account", icon: MdOutlineManageAccounts, href: "/setting" },
];

const SideBar = ({ children }: { children: ReactNode }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const {
		isOpen: isChatOpen,
		onOpen: onChatOpen,
		onClose: onChatClose,
	} = useDisclosure();
	return (
		<HStack
			minH="100vh"
			bg={useColorModeValue("gray.100", "gray.900")}
			alignItems="flex-start"
		>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", md: "flex" }}
			/>
			{/* This is the drawer that shows up when the user clicks the menu button on the top left corner in mobile view. */}
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="xs"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			<Drawer
				autoFocus={false}
				isOpen={isChatOpen}
				placement="right"
				onClose={onChatClose}
				returnFocusOnClose={false}
				onOverlayClick={onChatClose}
				size="xs"
			>
				<DrawerContent p="0" m="0">
					<ChatBox />
				</DrawerContent>
			</Drawer>
			<Box width="full">
				<MobileNav onOpen={onOpen} onChatOpen={onChatOpen} />
				<HStack alignItems="flex-start">
					<Box ml={{ base: 0, md: "433px" }} p="1" flexGrow="1">
						{children}
					</Box>
					{/* This is the chat box displayed on the right side of the screen. */}
				</HStack>
			</Box>
			{router.asPath !== "/setting" && (
				<Box display={{ base: "none", md: "block" }} p="0" m="0">
					<ChatBox />
				</Box>
			)}
		</HStack>
	);
};
export default SideBar;

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	const router = useRouter();
	const { isOpen, onOpen, onClose: modalOnClose } = useDisclosure();
	const [currentUser] = useAuthState(auth);

	return (
		<Flex
			direction="column"
			left={{ base: 0, md: "44" }}
			bg={useColorModeValue("white", "gray.900")}
			border="1px"
			px={4}
			py={2}
			borderColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: "2xs" }}
			minW="2xs"
			pos="fixed"
			top={0}
			h={{ base: "calc(100vh - calc(100vh - 100%))", md: "100vh" }}
			gap={4}
			{...rest}
		>
			<Flex alignItems="center" m="6" justifyContent="space-between">
				<Box>
					<Logo h="16" />
				</Box>

				<CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
			</Flex>
			<VStack w="full">
				{LinkItems.map((link) => (
					// Maps all the links to the NavItem component.
					<NavItem
						label={link.name}
						key={link.name}
						icon={link.icon}
						href={link.href}
						isActive={router.pathname === link.href}
					>
						{link.name}
					</NavItem>
				))}
				<NavItem
					label="Profile"
					key="Profile"
					icon={CgProfile}
					href={currentUser ? `/${currentUser?.email?.split("@")[0]}` : "/404"}
					isActive={router.asPath === `/${currentUser?.email?.split("@")[0]}`}
				>
					Profile
				</NavItem>
			</VStack>
			<Button
				onClick={onOpen}
				leftIcon={<FaRegPaperPlane />}
				variant="solid"
				colorScheme="teal"
				rounded="3xl"
				size="lg"
			>
				Chirp
			</Button>
			{/* This modal lets user create a chirp from anywhere in the app thats why it is place at the sidebar. */}
			<Modal
				isOpen={isOpen}
				onClose={modalOnClose}
				size="xl"
				preserveScrollBarGap
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<ModalCloseButton />
					</ModalHeader>
					<ModalBody>
						<CreateTweet />
					</ModalBody>
				</ModalContent>
			</Modal>
			<Spacer />

			<ThemeSelector />

			<Box>
				<SideBarProfile />
			</Box>
		</Flex>
	);
};
interface NavItemProps extends LinkProps {
	isActive?: boolean;
	href: string;
	label: string;
	icon: any;
}

const NavItem = (props: NavItemProps) => {
	const { icon, isActive, label, href, ...rest } = props;
	return (
		// Lights up the sidebar NavItem when the user is on that page using _activeLink component.
		<Link
			style={{ textDecoration: "none" }}
			_focus={{ boxShadow: "none" }}
			p={3}
			borderRadius="lg"
			fontSize="lg"
			fontWeight="semibold"
			lineHeight="1.5rem"
			role="group"
			cursor="pointer"
			w="full"
			_hover={{
				bg: useColorModeValue("blue.500", "blue.300"),
				color: useColorModeValue("white", "black"),
			}}
			as={NextLink}
			href={href}
			display="block"
			aria-current={isActive ? "page" : undefined}
			color={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
			_activeLink={{
				bg: useColorModeValue("blue.500", "blue.300"),
				color: useColorModeValue("white", "black"),
			}}
			{...rest}
		>
			<HStack spacing={4}>
				<Icon as={icon} boxSize="20px" />
				<Text as="span">{label}</Text>
			</HStack>
		</Link>
	);
};
NavItem.defaultProps = {
	isActive: false,
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
	onChatOpen: () => void;
}
const MobileNav = ({ onOpen, onChatOpen, ...rest }: MobileProps) => {
	const router = useRouter();
	return (
		<Flex
			ml={{ base: 0, md: 56 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent={{ base: "space-between", md: "flex-end" }}
			display={{ base: "flex", md: "none" }}
			{...rest}
		>
			<IconButton
				display={{ base: "flex", md: "none" }}
				onClick={onOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Logo h="8" display={{ base: "flex", md: "none" }} />
			{router.asPath !== "/setting" ? (
				<IconButton
					display={{ base: "flex", md: "none" }}
					onClick={onChatOpen}
					variant="outline"
					aria-label="open menu"
					icon={<ChatIcon />}
				/>
			) : (
				<p />
			)}
		</Flex>
	);
};
// This component is used to display the profile of the currentUser in the sidebar and lets the user sign out of the app using the Menu pop up.
const SideBarProfile = () => {
	const [currentUser, loading, error] = useAuthState(auth);
	const [signOut] = useSignOut(auth);
	const toast = useToast();
	if (loading) {
		return <SideBarProfileSkeleton />;
	}
	if (error) {
		return <Text>{error.message}</Text>;
	}
	if (currentUser) {
		return (
			<Flex mx="2">
				<Menu placement="top">
					<MenuButton py="2" _focus={{ boxShadow: "none" }} w="full">
						<HStack justifyContent="center" gap="2">
							<Avatar
								src={currentUser?.photoURL ?? "https://picsum.photos/200/300"}
							/>
							<VStack alignItems="flex-start" spacing="1px" ml="2">
								<Text fontSize="md" fontWeight="semibold">
									{currentUser?.displayName}
								</Text>
								<Text fontSize="xs" color="gray.600">
									@{currentUser?.email?.split("@")[0]}
								</Text>
							</VStack>
						</HStack>
						{/* This is the menu pop up that lets the user sign out of the app. */}
					</MenuButton>
					<MenuList
						p="0"
						m="0"
						minW="0"
						w="200px"
						borderColor="red.500"
						textColor="red.500"
					>
						<MenuItem
							as={Button}
							p="0"
							leftIcon={<BiLogOut />}
							colorScheme="red"
							variant="ghost"
							onClick={async () => {
								// signOut() hook react-firebase-hooks/auth
								const success = await signOut();
								if (success) {
									if (!toast.isActive("login")) {
										toast({
											title: `Logged out`,
											status: "success",
											isClosable: true,
											id: "login",
										});
									}
								}
							}}
						>
							Sign out
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		);
	}
	// If the user is not logged in, login and signup button is displayed in the sidebar instead of the profile where each button redirects to login page and signup page respectively.
	return (
		<VStack>
			<Button
				as={Link}
				variant="ghost"
				href="/auth/login"
				w="full"
				style={{ textDecoration: "none" }}
			>
				Login
			</Button>
			<Button
				as={Link}
				variant="solid"
				colorScheme="blue"
				href="/auth/register"
				w="full"
				style={{ textDecoration: "none" }}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export const SideBarProfileSkeleton = () => (
	<Flex mx="6">
		<HStack>
			<SkeletonCircle size="48px" />
			<VStack
				display={{ base: "none", md: "flex" }}
				alignItems="flex-start"
				spacing="1px"
				ml="2"
			>
				<Skeleton>
					<Text fontWeight="semibold">Avin Timilsina</Text>
				</Skeleton>
				<Skeleton>
					<Text color="gray.600">@avintimilsina</Text>
				</Skeleton>
			</VStack>
		</HStack>
	</Flex>
);
