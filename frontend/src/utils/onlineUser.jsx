export const isOnline = (onlineUsers, userId) => {
	return onlineUsers?.some((user) => user?.user?._id === userId);
};
