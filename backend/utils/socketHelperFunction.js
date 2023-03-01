let onlineUsers = [];

const addUser = (socketId, user) => {
	!onlineUsers.some((user) => user.socketId === socketId) &&
		onlineUsers.push({ socketId, user });
};

const removeUser = (socketId) => {
	onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getOnlineUsers = () => {
	return onlineUsers;
};

export { addUser, getOnlineUsers, removeUser };
