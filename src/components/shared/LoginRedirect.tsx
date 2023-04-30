import {
	Box,
	Button,
	ButtonProps,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import LoginPage from "../auth/LoginPage";

const LoginRedirect = (props: ButtonProps) => {
	const { isOpen, onOpen, onClose: modalOnClose } = useDisclosure();

	return (
		<>
			<Button onClick={onOpen} {...props} />

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
