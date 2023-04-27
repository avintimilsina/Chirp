import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { FaRegPaperPlane } from "react-icons/fa";
import LoginPage from "../auth/LoginPage";

const LoginRedirect = () => {
	const { isOpen, onOpen, onClose: modalOnClose } = useDisclosure();

	return (
		<>
			<Button
				colorScheme="teal"
				color="white"
				borderRadius="3xl"
				leftIcon={<FaRegPaperPlane />}
				onClick={onOpen}
				variant="solid"
			>
				Reply
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={modalOnClose}
				size="lg"
				preserveScrollBarGap
			>
				<ModalOverlay />
				<ModalContent bg={useColorModeValue("gray.50", "gray.800")}>
					<ModalBody m="0">
						<Box justify-content="center">
							<LoginPage isInModal />
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LoginRedirect;
