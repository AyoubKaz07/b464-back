import User from '../../models/user.js';

export const userResolvers = {
    Query: {
        users: async () => {
            const users = await User.find().lean();
            return users;
        },
        user: async (_, { id }) => {
            const user = await User.findById(id).lean();
            return user;
        }
    },
    Mutation: {
        regUser: async (_, { username, email, password }) => {
            const user = new User({ username, email, password });
            await user.save();
            return user;
        },
        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email, password })
            return user;
        },
        updateUser: async (_, { id, username, email, password }) => {
            const user = await User.findById(id);
            if (username) user.username = username;
            if (email) user.email = email;
            if (password) user.password = password;
            await user.save();
            return user;
        },
        deleteUser: async (_, { id }) => {
            const user = await User.findById(id);
            await user.remove();
            return {
                id,
                message: "User deleted successfully"
            };
        }
    }
};