import investor from "../../models/investor.js";
import validateEmail from "../../utils/validateEmail.js";

export const investorResolvers = {
  Mutation: {
    createInvestor: async (_, args) => {
      try {
        const { name, email, phone } = args.investor;
        if (!validateEmail(email)) throw new Error("Invalid email");
        const validInvestor = await investor.findOne({
          $or: [{ email }, { name }],
        });
        if (validInvestor) throw new Error("Investor already exists");
        const newInvestor = new investor({
          name,
          email,
          phone,
        });
        await newInvestor.save();
        return newInvestor;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
