/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useContext, useState } from "react";

type ChatContextType = {
	chatting: string | null;
	setChat: (user: string) => void;
};
const ChatContext = React.createContext<ChatContextType>({
	chatting: "",
	setChat: () => {},
});
const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }: any) => {
	const [chatting, setChatting] = useState<string>("");

	const setChat = (user: string) => {
		setChatting(user);
	};
	return (
		<ChatContext.Provider value={{ chatting, setChat }}>
			{children}
		</ChatContext.Provider>
	);
};

export { ChatProvider, useChat };

const ChatContextWrapper = ({ children }: any) => (
	<ChatProvider>{children}</ChatProvider>
);

export default ChatContextWrapper;
