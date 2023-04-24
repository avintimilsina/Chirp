import { Grid, Spinner } from "@chakra-ui/react";

// This is the spinner that is displayed when the page is loading.
const PageLoadingSpinner = () => (
	<Grid placeItems="center" height="100vh">
		<Spinner />
	</Grid>
);

export default PageLoadingSpinner;
