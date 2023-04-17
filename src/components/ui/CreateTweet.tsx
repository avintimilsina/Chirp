import {
	Avatar,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Textarea,
	useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps } from "formik";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Yup from "yup";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase";

const CreateTweet = () => {
	const [currentUser] = useAuthState(auth);
	const toast = useToast();

	return (
		<Formik
			initialValues={{ content: "" }}
			validationSchema={Yup.object({
				content: Yup.string()
					.required("Required")
					.max(280, "Chirp is too long"),
			})}
			onSubmit={async (values, actions) => {
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
				<Form>
					<HStack gap={2} alignItems="flex-start" my={2}>
						<Avatar
							size="lg"
							name={currentUser?.displayName ?? "User"}
							src={currentUser?.photoURL ?? "https://picsum.photos/200/300"}
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
										rows={6}
										bg="white"
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
							color="white"
							isLoading={props.isSubmitting}
							type="submit"
							mt={2}
							mb={5}
							borderRadius="3xl"
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
