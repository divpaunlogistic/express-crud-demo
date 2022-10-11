import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the Profile Schema for TypeScript.
 * @param name:ref => User._id
 * @param owner:string
 */
export interface IHouse extends Document {
    name: String,
    owner: IUser["_id"]
}

const houseSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

});

const House: Model<IHouse> = model("House", houseSchema);

export default House;
