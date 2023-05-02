import type { SelectProps, StackProps } from "@chakra-ui/react";
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Heading,
	IconButton,
	Input,
	Select,
	Stack,
	StackDivider,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Field, Form, Formik, FormikProps } from "formik";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { BiCurrentLocation } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import { auth, db } from "../../../firebase";
import ServiceLink from "../auth/ServiceLink";
import FileUploadModal from "../ui/FileUploadModal";
import PageLoadingSpinner from "../shared/PageLoadingSpinner";

const AccountSetting = () => {
	// Service Links for Google and Github are from firebase/auth package and not from react-firebase hooks.
	const googleProvider = new GoogleAuthProvider();
	const githubProvider = new GithubAuthProvider();
	const [currentUser, userLoading, userError] = useAuthState(auth);
	const [updateProfile, , updateError] = useUpdateProfile(auth);
	const router = useRouter();
	const [value, loading, bioError] = useDocumentData(
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
				coverPhoto: value?.coverPhoto ?? "https://picsum.photos/200/300",
				location: value?.location ?? "",
			}}
			validationSchema={Yup.object({
				name: Yup.string().required("Required"),
				email: Yup.string().email("Invalid email address").required("Required"),
			})}
			onSubmit={async (values, actions) => {
				if (values.name !== currentUser?.displayName) {
					const success = await updateProfile({ displayName: values.name });

					// If the update is successful, redirect to the user's profile page where the new name will be displayed.
					if (success) {
						router.push(`/${currentUser?.email?.split("@")[0]}`);
					}
				}

				// Checks if the bio, cover photo or location has changed. If it has, update the database using setDoc from firebase/firestore.
				if (
					values.bio !== value?.bio ||
					values.coverPhoto !== value?.coverPhoto ||
					values.location !== value?.location
				) {
					await setDoc(
						doc(db, "users", currentUser?.uid ?? ""),
						{
							bio: values.bio,
							coverPhoto: values.coverPhoto,
							location: values.location,
						},
						{ merge: true }
					);

					router.push(`/${currentUser?.email?.split("@")[0]}`);
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
						maxWidth={{ base: "xs", md: "xl" }}
						marginLeft={6}
					>
						<Heading size="lg" as="h1" paddingBottom="4">
							Account Settings
						</Heading>
						<FieldGroup title="Personal Info">
							<VStack spacing="4" width="full">
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
												isDisabled
												{...field}
												type="email"
												placeholder="your-email@example.com"
											/>
											<FormErrorMessage>{form.errors.email}</FormErrorMessage>
										</FormControl>
									)}
								</Field>
								<Field name="bio">
									{({ field }: any) => (
										<FormControl>
											<FormLabel>Bio</FormLabel>
											<Textarea {...field} rows={5} />
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
										src={currentUser?.photoURL!}
									/>
									<Box>
										{/* The FileUploadModal component is used to upload images to firebase storage for profile picture and cover picture of the currentUser */}
										<FileUploadModal
											onUpload={async (url) => {
												await updateProfile({ photoURL: url });
											}}
											imageRef={`images/profile/${
												currentUser?.uid ?? nanoid()
											}`}
										/>
									</Box>
								</Stack>
								<Stack direction="row" spacing="6" align="center" width="full">
									<Avatar
										size="xl"
										name={currentUser?.displayName ?? "-"}
										src={props.values.coverPhoto}
									/>

									<Box>
										<FileUploadModal
											onUpload={async (url) => {
												props.setFieldValue("coverPhoto", url);
											}}
											imageRef={`images/cover/${currentUser?.uid ?? nanoid()}`}
										/>
									</Box>
								</Stack>
							</VStack>
						</FieldGroup>
						<FieldGroup title="Preference">
							<VStack width="full" spacing="6" alignItems="flex-start">
								<LanguageSelect />
								<HStack
									width="full"
									alignItems="flex-end"
									justifyContent="flex-start"
									maxW="xs"
								>
									<Field name="location">
										{({ field, form }: any) => (
											<FormControl>
												<FormLabel>Location</FormLabel>
												<Input {...field} type="text" maxLength={255} />
												<FormErrorMessage>
													{form.errors.location}
												</FormErrorMessage>
											</FormControl>
										)}
									</Field>
									<IconButton
										aria-label="locate"
										icon={<BiCurrentLocation size="24" />}
										onClick={() => {
											// If the user allows the browser to access their location, get the city name using the getCityName function and set the location field to the city name.
											// getCurrentPosition is a function from the geolocation API.
											if (navigator?.geolocation) {
												navigator.geolocation.getCurrentPosition(
													async (location) => {
														if (location)
															props.setFieldValue(
																"location",
																await getCityName(
																	location.coords.latitude,
																	location.coords.longitude
																)
															);
													}
												);
											}
										}}
									/>
								</HStack>
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
								{/* The ServiceLink component is used to connect the users account with other services like GitHub, Google. */}
								{/* Here the providerId, serviceProvider, serviceName and serviceIcon props are passed to the ServiceLink component. */}
								<ServiceLink
									providerId="github.com"
									serviceProvider={githubProvider}
									serviceName="GitHub"
									serviceIcon={FaGithub}
								/>
								<ServiceLink
									providerId="google.com"
									serviceProvider={googleProvider}
									serviceName="Google"
									serviceIcon={FcGoogle}
								/>
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
export default AccountSetting;

interface FieldGroupProps extends StackProps {
	title?: string;
}
// The FieldGroup component is used to display the form fields in a group.
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
FieldGroup.defaultProps = {
	title: "",
};

// The LanguageSelect component is used to display the language options in a select field but currently it only has one option and has no functionality.
const LanguageSelect = (props: SelectProps) => (
	<FormControl id="language">
		<FormLabel>Display Language</FormLabel>
		<Select maxW="2xs" {...props}>
			<option>English</option>
		</Select>
	</FormControl>
);

// getCityName is an async function that takes the latitude and longitude of the user and returns the city name using the bigdatacloud API.
// Copy pasted from the internet.
const getCityName = async (lat: number, lng: number) => {
	const res = await fetch(
		`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
	);
	const data = await res.json();
	return ` ${data.locality}`;
};
