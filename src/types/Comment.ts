export interface IComment {
	id: string;
	content: string;
	createdAt: { seconds: number; nanoseconds: number };
	author: {
		userId: string;
		name: string;
		photoURL: string;
		username: string;
	};
}
