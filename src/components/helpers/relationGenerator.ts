const relationGenerator = (id1: string, id2: string) => {
	if (id1 < id2) {
		return `${id1}:${id2}`;
	}
	return `${id2}:${id1}`;
};
export default relationGenerator;
