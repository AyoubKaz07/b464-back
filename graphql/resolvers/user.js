import User from "../../models/user.js";
import validateEmail from "../../utils/validateEmail.js";
import jsonwebtoken from "jsonwebtoken"

//Done
export const userResolvers = {
  Query: {
    users: async (_, args, { user }) => {
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
        const { name, email, password, phone, pfp, wallet } = args.user;
        if (!validateEmail(email)) throw new Error("Invalid email");
        const validUser = await User.findOne({ $or: [{ email }, { name }] });
        if (validUser) throw new Error("User already exists");
        const user = new User({
          name,
          email,
          password: password,
          phone,
          pfp,
          wallet: wallet || 0,
        });
        await user.save();
        const token = jsonwebtoken.sign({ id: user._id,type : "user" }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return { user, token };
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
        const token = jsonwebtoken.sign({ id: user._id,type : "user" }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });

        return { user, token };
      } catch (e) {
        throw new Error(e);
      }
    },
    updateUser: async (_, args, { user }) => {
      try {
        const { name, email, password, wallet } = args.user;
        const id = args.id;
        if (user?.id != id) throw new Error("not Authorized");
        const updatedUser = await User.findById(id);
        if (name) updatedUser.name = name;
        if (email) {
          if (!validateEmail(email)) throw new Error("Invalid email");
          updatedUser.email = email;
        }
        if (password) updatedUser.password = password;
        if (wallet) updatedUser.wallet = wallet;
        await updatedUser.save();
        return updatedUser;
      } catch (e) {
        throw new Error(e);
      }
    },
    deleteUser: async (_, { id },{user}) => {
      try {
        if (user?.id != id) throw new Error("not Authorized");
        const deltedUser = await User.deleteOne({ _id: id });
        if (!deltedUser) throw new Error("User not found");

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
