export const isOnline = (onlineUsers, userId) => {
	return onlineUsers?.some((user) => user?.userId === userId);
};
