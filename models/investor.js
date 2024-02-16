import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const investorSchema = mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),
    },
    name: String,
    email: String,
    phone: String,
},
{
    timestamps: true,
    collection: "investors"
}
);

export default mongoose.model("Investor", investorSchema);