import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
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
			<Modal isOpen={isOpen} onClose={modalOnClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalBody p="0" alignItems="flex-start">
						<Box justify-content="center">
							<LoginPage />
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LoginRedirect;
