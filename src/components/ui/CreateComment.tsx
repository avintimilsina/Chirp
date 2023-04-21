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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Field, Form, Formik, FormikProps } from "formik";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaRegPaperPlane } from "react-icons/fa";
import * as Yup from "yup";
import { auth, db } from "../../../firebase";

interface CreateCommentProps {
	postId: string;
}

const CreateComment = ({ postId }: CreateCommentProps) => {
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
				const docRef = await addDoc(
					collection(db, "chirps", postId, "comments"),
					{
						author: {
							userId: currentUser?.uid,
							name: currentUser?.displayName,
							photoURL: currentUser?.photoURL,
							username: currentUser?.email?.split("@")[0],
						},
						content: values.content,
						createdAt: serverTimestamp(),
						postId,
					}
				);
				if (docRef.id) {
					toast({
						title: "Comment posted",
						status: "success",
						isClosable: true,
					});
				} else {
					toast({
						title: "Comment failed to post",
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
							name={currentUser?.displayName ?? "User"}
							src={currentUser?.photoURL ?? "https://picsum.photos/200/300"}
						/>
						<Field name="content">
							{({ field, form }: any) => (
								<FormControl
									isInvalid={form.errors.content && form.touched.content}
								>
									<FormLabel htmlFor="createComment" srOnly>
										Comment
									</FormLabel>
									<Textarea
										id="createComment"
										{...field}
										placeholder="Chirp Your Reply"
										variant="unstyled"
										rows={1}
										bg="white"
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
							borderRadius="3xl"
							leftIcon={<FaRegPaperPlane />}
						>
							Reply
						</Button>
					</Flex>
				</Form>
			)}
		</Formik>
	);
};

export default CreateComment;
