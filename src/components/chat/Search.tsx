import { FormControl, FormLabel } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { collection, query } from "firebase/firestore";
import { useId } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import { useChat } from "../contexts/ChatContext";

const Search = () => {
	const id = useId();
	const { setChat } = useChat();
	const [values, , error] = useCollectionData(query(collection(db, "users")), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});
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
				instanceId={id}
				name="Chat"
				placeholder="🔍 Search Someone"
				closeMenuOnSelect={false}
				onChange={(e: any) => {
					setChat(e.value);
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
