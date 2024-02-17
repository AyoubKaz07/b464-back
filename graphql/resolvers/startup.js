import startup from "../../models/startup.js";
import validateEmail from "../../utils/validateEmail.js";
import jsonwebtoken from "jsonwebtoken";

export const startupResolvers = {
  Query: {
    startups: async (_, args) => {
      try {
        const startups = await startup.aggregate([
          {
            $project: {
              _id: 1,
              name: 1,
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
              whyUs: 1,
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
        return startups;
      } catch (e) {
        throw new Error(e);
      }
    },
    startup: async (_, { id }) => {
      try {
        const startups = await startup.aggregate([
          { $match: { _id: id } },
          {
            $project: {
              _id: 1,
              name: 1,
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
              whyUs: 1,
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
        return startups[0];
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
          whyUs,
        } = args.startup;
        const valid = await startup.findOne({ $or: [{ email }, { name }] });
        if (valid) throw new Error("User exists");
        let newStartup = new startup({
          name: name,
          password: password,
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
          whyUs: whyUs,
        });
        await newStartup.save();
        const id = newStartup._id;
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
              whyUs: 1,
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
        const token = jsonwebtoken.sign(
          { id: newStartup._id, type: "startup" },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        return { startup: newStartup[0], token };
      } catch (e) {
        throw new Error(e);
      }
    },
    updateStartup: async (_, args, { user }) => {
      try {
        if (user.id != args.id) throw new Error("Unauthorized");
        console.log(user.id);
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
    deleteStartup: async (_, { id }, { user }) => {
      if (user.id != id) throw new Error("Unauthorized");
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
    loginStartup: async (_, { email, password }) => {
      try {
        const loggedInStartup = await startup.findOne({ email });
        if (!loggedInStartup) throw new Error("Startup not found");
        const valid = await loggedInStartup.comparePassword(password);
        if (!valid) throw new Error("Invalid password");
        const token = jsonwebtoken.sign(
          { id: loggedInStartup._id, type: "startup" },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );
        return { startup: loggedInStartup, token };
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
