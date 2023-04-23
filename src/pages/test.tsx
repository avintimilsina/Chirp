import relationGenerator from "@/components/helpers/relationGenerator";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";

const Test = () => {
	const [currentUser] = useAuthState(auth);
	const [values, loading, error] = useCollectionData(
		query(
			collection(db, "chats"),
			where(
				"relation",
				"==",
				relationGenerator(
					currentUser?.uid ?? "-",
					"hyMaHGxcBZa6UdJCxe4iK6TvcK33"
				)
			)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	if (loading) {
		return <div>Loading</div>;
	}
	if (error) {
		return <div>Error</div>;
	}
	console.log(values?.[0]);
	return <div>Test</div>;
};

export default Test;
