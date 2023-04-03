import { Link } from "@chakra-ui/next-js";
import {
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Stack,
	useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps } from "formik";
import {
	useCreateUserWithEmailAndPassword,
	useSendEmailVerification,
	useUpdateProfile,
} from "react-firebase-hooks/auth";
import * as Yup from "yup";
import { auth } from "../../../firebase";
import { useRouter } from "next/router";

const RegisterForm = () => {
	const router = useRouter();
	const toast = useToast();
	const [createUserWithEmailAndPassword, user, loading, error] =
		useCreateUserWithEmailAndPassword(auth);
	const [updateProfile] = useUpdateProfile(auth);
	const [sendEmailVerification] = useSendEmailVerification(auth);

	return (
		<Formik
			initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
			validationSchema={Yup.object({
				firstName: Yup.string().required("Required"),
				lastName: Yup.string().required("Required"),
				email: Yup.string().email("Invalid email address").required("Required"),
				password: Yup.string()
					.required("Required")
					.min(8, "At least 8 characters long")
					.max(30, "At most 30 characters long"),
			})}
			onSubmit={async (values, actions) => {
				const response = await createUserWithEmailAndPassword(
					values.email,
					values.password
				);
				if (response) {
					const success = await updateProfile({
						displayName: `${values.firstName} ${values.lastName}`,
					});
					if (success) {
						const emailVerification = await sendEmailVerification();
						if (emailVerification) {
							toast({
								title: `Registered successfully`,
								status: "success",
								isClosable: true,
								id: "register",
							});
						}
						router.push("/auth/verify-email");
					}
				} else {
					if (error) {
						if (!toast.isActive("register")) {
							toast({
								title: error.message,
								status: "error",
								isClosable: true,
								id: "register",
							});
						}
					}
				}
				actions.setSubmitting(false);
			}}
		>
			{(props: FormikProps<any>) => (
				<Form>
					<HStack>
						<Field name="firstName">
							{({ field, form }: any) => (
								<FormControl
									isInvalid={form.errors.firstName && form.touched.firstName}
								>
									<FormLabel>First Name</FormLabel>
									<Input {...field} type="text" placeholder="First Name" />
									<FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
								</FormControl>
							)}
						</Field>
						<Field name="lastName">
							{({ field, form }: any) => (
								<FormControl
									isInvalid={form.errors.lastName && form.touched.lastName}
								>
									<FormLabel>Last Name</FormLabel>
									<Input {...field} type="text" placeholder="Last Name" />
									<FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
								</FormControl>
							)}
						</Field>
					</HStack>
					<Field name="email">
						{({ field, form }: any) => (
							<FormControl isInvalid={form.errors.email && form.touched.email}>
								<FormLabel>Email</FormLabel>
								<Input {...field} type="email" placeholder="Email" />
								<FormErrorMessage>{form.errors.email}</FormErrorMessage>
							</FormControl>
						)}
					</Field>
					<Field name="password">
						{({ field, form }: any) => (
							<FormControl
								isInvalid={form.errors.password && form.touched.password}
							>
								<FormLabel>Password</FormLabel>
								<Input {...field} type="password" placeholder="Password" />
								<FormErrorMessage>{form.errors.password}</FormErrorMessage>
							</FormControl>
						)}
					</Field>

					<Stack spacing={10}>
						<Stack
							direction={{ base: "column", sm: "row" }}
							align={"start"}
							justify={"space-between"}
						>
							<Checkbox>Remember me</Checkbox>
							<Link href="/auth/forget-password" color={"blue.400"}>
								Forgot password?
							</Link>
						</Stack>
						<Button
							bg={"blue.400"}
							color={"white"}
							isLoading={props.isSubmitting}
							type="submit"
							_hover={{
								bg: "blue.500",
							}}
						>
							Sign up
						</Button>
					</Stack>
				</Form>
			)}
		</Formik>
	);
};

export default RegisterForm;
