import {
	Avatar,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Textarea,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Field, Form, Formik, FormikProps } from "formik";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaRegPaperPlane } from "react-icons/fa";
import * as Yup from "yup";
import { auth, db } from "../../../firebase";

const CreateTweet = () => {
	const [currentUser] = useAuthState(auth);
	const toast = useToast();
	const textBoxBgColor = useColorModeValue("whitesmoke", "gray.700");
	return (
		<Formik
			initialValues={{ content: "" }}
			validationSchema={Yup.object({
				content: Yup.string()
					.required("Required")
					.max(280, "Chirp is too long"),
			})}
			onSubmit={async (values, actions) => {
				// Add a new document with a generated id with the values of the user and the content of the chirp inside the chirps collection in the database.
				const docRef = await addDoc(collection(db, "chirps"), {
					author: {
						userId: currentUser?.uid,
						name: currentUser?.displayName,
						photoURL: currentUser?.photoURL,
						username: currentUser?.email?.split("@")[0],
					},
					content: values.content,
					createdAt: serverTimestamp(),
				});
				if (docRef.id) {
					toast({
						title: "Chirp created",
						status: "success",
						isClosable: true,
					});
				} else {
					toast({
						title: "Chirp failed to create",
						status: "error",
						isClosable: true,
					});
				}
				actions.setSubmitting(false);
				actions.resetForm();
			}}
		>
			{(props: FormikProps<any>) => (
				// Create a simple form with a textarea for the user to type their chirp in and a button to submit the chirp to be displayed in the HomePage.
				<Form>
					<HStack gap={2} alignItems="flex-start" my={2}>
						<Avatar
							size="lg"
							name={currentUser?.displayName ?? "User"}
							src={
								currentUser?.photoURL ??
								"https://api.dicebear.com/6.x/thumbs/svg?seed=Missy"
							}
						/>
						<Field name="content">
							{({ field, form }: any) => (
								<FormControl
									isInvalid={form.errors.content && form.touched.content}
								>
									<FormLabel htmlFor="createTweet" srOnly>
										Tweet
									</FormLabel>
									<Textarea
										id="createTweet"
										{...field}
										placeholder="Chirp Away!"
										variant="unstyled"
										rows={4}
										bg={textBoxBgColor}
										p={4}
										fontSize="lg"
										borderBottom="none"
										focusBorderColor="transparent"
										borderRadius="lg"
									/>
								</FormControl>
							)}
						</Field>
					</HStack>
					<Flex width="full" justifyContent="flex-end">
						<Button
							colorScheme="teal"
							isLoading={props.isSubmitting}
							type="submit"
							mt={2}
							mb={5}
							px={8}
							borderRadius="3xl"
							leftIcon={<FaRegPaperPlane />}
						>
							Chirp
						</Button>
					</Flex>
				</Form>
			)}
		</Formik>
	);
};

export default CreateTweet;
