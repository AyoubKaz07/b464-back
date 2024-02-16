import startup from "../../models/startup.js";
import validateEmail from "../../utils/validateEmail.js";

export const startupResolvers = {
  Query: {
    startups: async (_, args) => {
      try {
        return await startup.find({}).lean();
      } catch (e) {
        throw new Error(e);
      }
    },
    startup: async (_, { id }) => {
      try {
        return await startup.findById(id).lean();
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    createStartup: async (_, args) => {
      try {
        const {
          name,
          password,
          shortDesc,
          desc,
          email,
          phone,
          address,
          socialMedia,
          website,
          logo,
          founders,
          monitized,
          video,
          dateOfCreation,
        } = args.startup;
        if (!validateEmail(email)) throw new Error("Invalid email");
        const hashedPass = await bcrypt.hash(password, 10);
        let newStartup = new startup({
          name: name,
          password: hashedPass,
          shortDesc: shortDesc,
          desc: desc,
          email: email,
          phone: phone,
          address: address,
          socialMedia: socialMedia,
          website: website,
          logo: logo,
          founders: founders,
          monitized: monitized,
          video: video,
          dateOfCreation: dateOfCreation,
        });
        await newStartup.save();
        const id = newStartup._id;
        const valid = await startup.findOne({ $or: [{ email }, { name }] });
        if (valid) throw new (Error("Email in use"))();
        newStartup = await startup.aggregate([
          {
            $match: { _id: id },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              password: 1,
              shortDesc: 1,
              desc: 1,
              email: 1,
              phone: 1,
              address: 1,
              socialMedia: 1,
              website: 1,
              logo: 1,
              founders: 1,
              monitized: 1,
              video: 1,
              dateOfCreation: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "founders",
              foreignField: "_id",
              as: "founders",
            },
          },
        ]);
        return newStartup[0];
      } catch (e) {
        throw new Error(e);
      }
    },
    updateStartup: async (_, args) => {
      try {
        if (args.startup.password) {
          const hashedPass = await bcrypt.hash(args.startup.password, 10);
          args.startup.password = hashedPass;
        }
        if (args.startup.email) {
          if (!validateEmail(args.startup.email))
            throw new Error("Invalid email");
        }
        return await startup
          .findByIdAndUpdate(args.id, args.startup, { new: true })
          .lean();
      } catch (e) {
        throw new Error(e);
      }
    },
    deleteStartup: async (_, { id }) => {
      try {
        await startup.findByIdAndDelete(id);
        return {
          success: true,
          message: "Startup deleted successfully",
        };
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
