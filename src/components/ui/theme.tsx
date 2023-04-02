import { IconButton, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSelector = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<div>
			{colorMode === "dark" ? (
				<IconButton
					variant="outline"
					aria-label="dark"
					icon={<FaSun size={24} color="white" />}
					onClick={toggleColorMode}
				/>
			) : (
				<IconButton
					variant="outline"
					aria-label="light"
					icon={<FaMoon size={24} />}
					onClick={toggleColorMode}
				/>
			)}
		</div>
	);
};

export default ThemeSelector;
