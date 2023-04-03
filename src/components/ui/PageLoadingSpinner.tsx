import { Grid, Spinner } from "@chakra-ui/react";
import React from "react";

const PageLoadingSpinner = () => {
	return (
		<Grid placeItems={"center"} height={"100vh"}>
			<Spinner />
		</Grid>
	);
};

export default PageLoadingSpinner;
