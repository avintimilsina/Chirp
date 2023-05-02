import { Button, Fade, useColorMode } from "@chakra-ui/react";
import { BsMoon, BsSun } from "react-icons/bs";

const ThemeSelector = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Fade in>
			<Button
				w="full"
				justifyContent="center"
				aria-label="Theme Switch"
				onClick={toggleColorMode}
				leftIcon={colorMode === "light" ? <BsMoon /> : <BsSun />}
			>
				{colorMode === "light" ? "Go Dark " : "Go Light "}
			</Button>
		</Fade>
	);
};
export default ThemeSelector;
