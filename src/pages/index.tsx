import { Link } from "@chakra-ui/next-js";
import { NextPage } from "next";
import LogOut from "./auth/logout";
import TweetCard from "@/components/ui/TweetCard";
import ProfileDashboard from "@/components/ui/ProfileDashboard";
import { TWEETS } from "@/components/data/tweets";
import { Box, VStack } from "@chakra-ui/react";
import CreateTweet from "@/components/ui/CreateTweet";

const HomePage: NextPage = () => {
	return (
		<div>
			{/* <h1>HomePage</h1>
			<Link href="/auth/login">Login In</Link>
			<LogOut />
			<Link href="/auth/register">Register</Link> */}
			<Box width={"full"} maxW={"2xl"}>
				<CreateTweet />
				<VStack width={"full"} alignItems={"flex-start"}>
					{TWEETS.map((tweet) => (
						<TweetCard key={tweet.id} tweet={tweet} />
					))}
				</VStack>
			</Box>
			{/* 
			<ProfileDashboard /> */}
		</div>
	);
};

export default HomePage;
