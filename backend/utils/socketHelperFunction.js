let onlineUsers = [];
let chats = [];

const addUser = (socketId, userId) => {
	!onlineUsers.some((user) => user.socketId === socketId) &&
		onlineUsers.push({ socketId, userId });
};

const removeUser = (socketId) => {
	onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return onlineUsers.find((user) => user.userId === userId);
};

const updateUser = (room, userId) => {
	const foundUser = onlineUsers.find((user) => user.userId === userId);

	if (foundUser) {
		const updatedUser = { ...foundUser, room };

		return updatedUser;
	}
};

const getOnlineUsers = () => {
	return onlineUsers;
};

const joinChat = (room, userId) => {
	!chats.some((chat) => chat.userId === userId) && chats.push({ room, userId });

	return chats;
};

const getChat = (room) => {
	return chats.find((chat) => chat.room === room);
};

export {
	addUser,
	getOnlineUsers,
	removeUser,
	getUser,
	joinChat,
	getChat,
	updateUser,
};
