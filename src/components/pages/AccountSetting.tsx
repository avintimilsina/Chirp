import type { SelectProps, StackProps } from "@chakra-ui/react";
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Heading,
	Input,
	Select,
	Stack,
	StackDivider,
	Text,
	Textarea,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { HiCloudUpload } from "react-icons/hi";
import * as Yup from "yup";
import { auth, db } from "../../../firebase";
import PageLoadingSpinner from "../ui/PageLoadingSpinner";

export const AccountSetting = () => {
	const [currentUser, userLoading, userError] = useAuthState(auth);
	const [updateProfile, updating, updateError] = useUpdateProfile(auth);
	const toast = useToast();
	const router = useRouter();
	const [value, loading, bioError, snapshot] = useDocumentData(
		doc(db, "users", currentUser?.uid ?? "-"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (loading || userLoading) {
		return <PageLoadingSpinner />;
	}
	if (bioError || userError || updateError) {
		return <PageLoadingSpinner />;
	}
	return (
		<Formik
			initialValues={{
				name: currentUser?.displayName,
				email: currentUser?.email,
				bio: value?.bio ?? "",
				profilePhoto: currentUser?.photoURL,
				coverPhoto: "https://picsum.photos/200/300",
			}}
			validationSchema={Yup.object({
				name: Yup.string().required("Required"),
				email: Yup.string().email("Invalid email address").required("Required"),
			})}
			onSubmit={async (values, actions) => {
				if (values.name !== currentUser?.displayName) {
					const success = await updateProfile({ displayName: values.name });
					if (success) {
						router.push("/profile");
					}
				}
				if (values.bio !== value?.bio) {
					await setDoc(doc(db, "users", currentUser?.uid ?? ""), {
						bio: values.bio,
					});

					router.push("/profile");
				}
				actions.setSubmitting(false);
				actions.resetForm();
			}}
		>
			{(props: FormikProps<any>) => (
				<Form>
					<Stack
						spacing="4"
						divider={<StackDivider />}
						maxWidth={"3xl"}
						marginLeft={6}
					>
						<Heading size="lg" as="h1" paddingBottom="4">
							Account Settings
						</Heading>
						<FieldGroup title="Personal Info">
							<VStack spacing="4" width={"full"}>
								<Field name="name">
									{({ field, form }: any) => (
										<FormControl>
											<FormLabel>Name</FormLabel>
											<Input {...field} type="text" maxLength={255} />
											<FormErrorMessage>{form.errors.name}</FormErrorMessage>
										</FormControl>
									)}
								</Field>
								<Field name="email">
									{({ field, form }: any) => (
										<FormControl>
											<FormLabel>Email</FormLabel>
											<Input
												isDisabled={true}
												{...field}
												type="email"
												placeholder="your-email@example.com"
											/>
											<FormErrorMessage>{form.errors.email}</FormErrorMessage>
										</FormControl>
									)}
								</Field>
								<Field name="bio">
									{({ field, form }: any) => (
										<FormControl>
											<FormLabel>Bio</FormLabel>
											<Textarea {...field} rows={5} />
											<FormHelperText>
												Brief description for your profile. URLs are
												hyperlinked.
											</FormHelperText>
										</FormControl>
									)}
								</Field>
							</VStack>
						</FieldGroup>

						<FieldGroup title="Profile Photo">
							<VStack gap={4}>
								<Stack direction="row" spacing="6" align="center" width="full">
									<Avatar
										size="xl"
										name={currentUser?.displayName ?? "-"}
										src={
											currentUser?.photoURL ?? "https://picsum.photos/200/300"
										}
									/>
									<Box>
										<HStack spacing="5">
											<Button leftIcon={<HiCloudUpload />}>Change photo</Button>
											<Button variant="ghost" colorScheme="red">
												Delete
											</Button>
										</HStack>
										<Text
											fontSize="sm"
											mt="3"
											// color={useColorModeValue("gray.500", "whiteAlpha.600")}
										>
											.jpg, .gif, or .png. Max file size 700K.
										</Text>
									</Box>
								</Stack>
								<Stack direction="row" spacing="6" align="center" width="full">
									<Avatar
										size="xl"
										name="Alyssa Mall"
										src={"https://picsum.photos/200/300"}
									/>
									<Box>
										<HStack spacing="5">
											<Button leftIcon={<HiCloudUpload />}>Change photo</Button>
											<Button variant="ghost" colorScheme="red">
												Delete
											</Button>
										</HStack>
										<Text
											fontSize="sm"
											mt="3"
											// color={useColorModeValue("gray.500", "whiteAlpha.600")}
										>
											.jpg, .gif, or .png. Max file size 700K.
										</Text>
									</Box>
								</Stack>
							</VStack>
						</FieldGroup>

						<FieldGroup title="Language">
							<VStack width="full" spacing="6">
								<LanguageSelect />
							</VStack>
						</FieldGroup>
						<FieldGroup title="Notifications">
							<Stack width="full" spacing="4">
								<Checkbox>Get updates about the latest meetups.</Checkbox>
								<Checkbox>
									Get notifications about your account activities
								</Checkbox>
							</Stack>
						</FieldGroup>
						<FieldGroup title="Connect accounts">
							<HStack width="full">
								<Button variant="outline" leftIcon={<FaGithub />}>
									Connect Github
								</Button>
								<Button
									variant="outline"
									leftIcon={<Box as={FaGoogle} color="red.400" />}
								>
									Connect Google
								</Button>
							</HStack>
						</FieldGroup>
					</Stack>
					<FieldGroup mt="8">
						<HStack width="full">
							<Button
								type="submit"
								colorScheme="blue"
								isLoading={props.isSubmitting}
								isDisabled={!props.dirty}
							>
								Save Changes
							</Button>
							<Button variant="outline">Cancel</Button>
						</HStack>
					</FieldGroup>
				</Form>
			)}
		</Formik>
	);
};

interface FieldGroupProps extends StackProps {
	title?: string;
}

const FieldGroup = (props: FieldGroupProps) => {
	const { title, children, ...flexProps } = props;
	return (
		<Stack
			direction={{ base: "column", md: "row" }}
			spacing="6"
			py="4"
			{...flexProps}
		>
			<Box minW="3xs">
				{title && (
					<Heading as="h2" fontWeight="semibold" fontSize="lg" flexShrink={0}>
						{title}
					</Heading>
				)}
			</Box>
			{children}
		</Stack>
	);
};

const LanguageSelect = (props: SelectProps) => (
	<FormControl id="language">
		<FormLabel>Display Language</FormLabel>
		<Select maxW="2xs" {...props}>
			<option>English</option>
			<option>Hebrew</option>
			<option>Arabic</option>
		</Select>
	</FormControl>
);
