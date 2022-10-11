import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the Profile Schema for TypeScript.
 * @param user:ref => User._id
 * @param title:string
 * @param description:string
 */
export interface IBook extends Document {
  title: IUser["_id"];
  name: string;
  description: string;
}

const bookSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Book: Model<IBook> = model("Book", bookSchema);

export default Book;
