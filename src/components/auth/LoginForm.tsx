import { Link } from "@chakra-ui/next-js";
import {
	Button,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikProps } from "formik";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import * as Yup from "yup";
import { auth } from "../../../firebase";

const LoginForm = () => {
	const [signInWithEmailAndPassword, user, loading, error] =
		useSignInWithEmailAndPassword(auth);
	const toast = useToast();

	return (
		<Formik
			initialValues={{ email: "", password: "" }}
			validationSchema={Yup.object({
				email: Yup.string().email("Invalid email address").required("Required"),
				password: Yup.string()
					.required("Required")
					.min(8, "At least 8 characters long")
					.max(30, "At most 30 characters long"),
			})}
			onSubmit={async (values, actions) => {
				const response = await signInWithEmailAndPassword(
					values.email,
					values.password
				);
				console.log(response);
				if (response) {
					if (!toast.isActive("login")) {
						toast({
							title: `Successfully logged in`,
							status: "success",
							isClosable: true,
							id: "login",
						});
					}
				} else {
					if (error) {
						if (!toast.isActive("login")) {
							toast({
								title: error.message,
								status: "error",
								isClosable: true,
								id: "login",
							});
						}
					}
				}
				actions.setSubmitting(false);
			}}
		>
			{(props: FormikProps<any>) => (
				<Form>
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
							Sign in
						</Button>
					</Stack>
				</Form>
			)}
		</Formik>
	);
};

export default LoginForm;
