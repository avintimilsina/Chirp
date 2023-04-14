import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage } from "../../firebase";

const TestPage = () => {
	const {
		isOpen: isUploadFileModalOpen,
		onOpen: onUploadFileModalOpen,
		onClose: onUploadFileModalClose,
	} = useDisclosure();
	const [fileUploadProgress, setFileUploadProgress] = useState(0);
	const [selectedFile, setSelectedFile] = useState<File | undefined>();
	const toast = useToast();
	const [currentUser, loading, userError] = useAuthState(auth);
	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (userError) {
		return <PageLoadingSpinner />;
	}
	return (
		<>
			<Button size="xs" colorScheme="green" onClick={onUploadFileModalOpen}>
				Upload
			</Button>

			<Modal
				preserveScrollBarGap
				isOpen={isUploadFileModalOpen}
				onClose={onUploadFileModalClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Upload a File</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							type="file"
							onChange={(e) => setSelectedFile(e?.target.files?.[0])}
							border={0}
						/>
						<Progress hasStripe value={fileUploadProgress} />
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="red"
							variant="outline"
							mr={3}
							onClick={onUploadFileModalClose}
						>
							Close
						</Button>
						<Button
							colorScheme="green"
							onClick={async () => {
								const imageRef = `images/profile/${
									currentUser?.uid ?? nanoid()
								}`;
								const uploadTask = uploadBytesResumable(
									ref(storage, imageRef),
									selectedFile!
								);

								uploadTask.on(
									"state_changed",
									(snapshot) => {
										setFileUploadProgress(
											Math.round(
												(snapshot.bytesTransferred / snapshot.totalBytes) * 100
											)
										);
									},
									(error) =>
										toast({
											title: "An Error Occurred",
											description: error.message,
											status: "error",
											duration: 5000,
											isClosable: true,
										}),
									async () => {
										await getDownloadURL(ref(storage, imageRef)).then(
											(downloadURL) => {
												console.log(downloadURL);
												onUploadFileModalClose();
											}
										);
									}
								);
							}}
						>
							Upload
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default TestPage;
