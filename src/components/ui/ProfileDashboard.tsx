import React from "react";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { FaEnvelope, FaMapPin, FaSuitcase } from "react-icons/fa";

const ProfileDashboard = () => {
	return (
		<Flex
			bg="#edf3f8"
			_dark={{ bg: "#3e3e3e" }}
			p={50}
			w="full"
			alignItems="center"
			justifyContent="center"
		></Flex>
	);
};
export default ProfileDashboard;
