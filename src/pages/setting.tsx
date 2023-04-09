import { AccountSetting } from "@/components/pages/AccountSetting";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import PageLoadingSpinner from "@/components/ui/PageLoadingSpinner";

const Setting = () => {
	const [currentUser, loading, error] = useAuthState(auth);
	if (loading) {
		return <PageLoadingSpinner />;
	}
	if (error) {
		return <PageLoadingSpinner />;
	}
	return <AccountSetting currentUser={currentUser} />;
};

export default Setting;
