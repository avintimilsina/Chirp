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
	Spacer,
	Text,
	VStack,
	useColorModeValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import NextLink from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { IconType } from "react-icons";
import { BsThreeDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";
import { FiHome, FiMenu } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { auth } from "../../../firebase";
import Logo from "../logo";

interface LinkItemProps {
	name: string;
	icon: IconType;
	href: string;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: "Home", icon: FiHome, href: "/" },
	{ name: "Profile", icon: CgProfile, href: "/profile" },
	{ name: "Account", icon: MdOutlineManageAccounts, href: "/setting" },
];

const SideBar = ({ children }: { children: ReactNode }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<HStack minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", md: "flex" }}
			/>
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
			<Box width="full">
				<MobileNav onOpen={onOpen} />
				<Box ml={{ base: 0, md: 60 }} p="4">
					{children}
				</Box>
			</Box>
		</HStack>
	);
};
export default SideBar;

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	const [currentUser] = useAuthState(auth);
	const [signOut] = useSignOut(auth);
	const toast = useToast();
	const router = useRouter();

	return (
		<Flex
			direction="column"
			transition="3s ease"
			bg={useColorModeValue("white", "gray.900")}
			borderRight="1px"
			px={4}
			py={2}
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: "60" }}
			pos="fixed"
			top={0}
			h="100vh"
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
			</VStack>
			<Spacer />
			<Box mb="5">
				{!currentUser ? (
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
				) : (
					<Flex mx="6">
						<Menu placement="top">
							<MenuButton
								py={2}
								transition="all 0.3s"
								_focus={{ boxShadow: "none" }}
							>
								<HStack>
									<Avatar
										size="md"
										src={
											currentUser?.photoURL ?? "https://picsum.photos/200/300"
										}
									/>
									<VStack
										display={{ base: "none", md: "flex" }}
										alignItems="flex-start"
										spacing="1px"
										ml="2"
									>
										<Text fontSize="lg" fontWeight="semibold">
											{currentUser?.displayName}
										</Text>
										<Text fontSize="xs" color="gray.600">
											@{currentUser?.email?.split("@")[0]}
										</Text>
									</VStack>
									<Box display={{ base: "none", md: "flex" }}>
										<BsThreeDots />
									</Box>
								</HStack>
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
				)}
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
		<Link
			style={{ textDecoration: "none" }}
			_focus={{ boxShadow: "none" }}
			p={5}
			borderRadius="lg"
			transition="all 0.3s"
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
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => (
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

		<Box />
	</Flex>
);
