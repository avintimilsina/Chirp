import { FormControl, FormLabel, Spinner } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { collection, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";

const Search = () => {
	const [values, loading, error] = useCollectionData(
		query(collection(db, "users")),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const router = useRouter();
	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	return (
		<FormControl p={4}>
			<FormLabel fontSize="2xl" fontWeight="bold" htmlFor="Chat">
				Chat
			</FormLabel>
			<AsyncSelect
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null,
				}}
				name="Chat"
				placeholder="🔍 Search Someone"
				closeMenuOnSelect={false}
				onChange={(e: any) => {
					router.push({
						pathname: "",
						query: { chatting: e.value },
					});
				}}
				size="md"
				loadOptions={(inputValue, callback) => {
					const filteredValues = values
						?.filter((i) =>
							i.displayName.toLowerCase().includes(inputValue.toLowerCase())
						)
						.map((i) => ({
							label: i.displayName as string,
							value: i.uid as string,
						}));
					callback(filteredValues!);
				}}
			/>
		</FormControl>
	);
};

export default Search;
