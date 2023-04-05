import { Link } from "@chakra-ui/next-js";
import { NextPage } from "next";
import LogOut from "./auth/logout";
import TweetCard from "@/components/ui/TweetCard";
import ProfileDashboard from "@/components/ui/ProfileDashboard";

const HomePage: NextPage = () => {
	return (
		<div>
			<h1>HomePage</h1>
			<Link href="/auth/login">Login In</Link>
			<LogOut />
			<Link href="/auth/register">Register</Link>
			<TweetCard />
			<ProfileDashboard />
		</div>
	);
};

export default HomePage;
