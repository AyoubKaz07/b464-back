import User from "../../models/user.js";
import validateEmail from "../../utils/validateEmail.js";

//Done
export const userResolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.find().lean();

        return users;
      } catch (e) {
        throw new Error(e);
      }
    },
    user: async (_, { email }) => {
      try {
        const user = (await User.find({ email }).lean())[0];

        return user;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    regUser: async (_, args) => {
      try {
        const { name, email, password, phone } = args.user;
        if (!validateEmail(email)) throw new Error("Invalid email");
        const validUser = await User.findOne({ $or: [{ email }, { name }] });
        if (validUser) throw new Error("User already exists");
        const user = new User({
          name,
          email,
          password: password,
          phone,
          wallet: 0,
        });
        await user.save();
        https: return user;
      } catch (e) {
        throw new Error(e);
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const valid = await user.comparePassword(password, user.password);
        if (!valid) throw new Error("Invalid password");
        return user;
      } catch (e) {
        throw new Error(e);
      }
    },
    updateUser: async (_, args) => {
      try {
        const { name, email, password, wallet } = args.user;
        const id = args.id;
        const user = await User.findById(id);
        if (name) user.name = name;
        if (email) {
          if (!validateEmail(email)) throw new Error("Invalid email");
          user.email = email;
        }
        if (password) user.password = password;
        if (wallet) user.wallet = wallet;
        await user.save();
        return user;
      } catch (e) {
        throw new Error(e);
      }
    },
    deleteUser: async (_, { email }) => {
      try {
        const user = await User.deleteOne({ email });
        if (!user) throw new Error("User not found");

        return {
          success: true,
          message: "User deleted successfully",
        };
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
