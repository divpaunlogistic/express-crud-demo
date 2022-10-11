import { Document, Model, model, Schema } from "mongoose";
import { ITutorial } from "./Tutorial";

/**
 * Interface to model the Profile Schema for TypeScript.
 * @param name:ref => User._id
 * @param owner:string
 */
export interface ITag extends Document {
    title: String,
    tutorials: ITutorial["_id"]
}

const tutorialSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    tutorials: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tutorial"
        }
      ],

});

const Tag: Model<ITag> = model("Tag", tutorialSchema);

export default Tag;
