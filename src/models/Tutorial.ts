import { Document, Model, model, Schema } from "mongoose";
import { ITag } from "./Tag";

/**
 * Interface to model the Profile Schema for TypeScript.
 * @param name:ref => User._id
 * @param owner:string
 */
export interface ITutorial extends Document {
    title: String,
    tags: ITag["_id"]
}

const tutorialSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    tags: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tag"
        }
      ],

});

const Tutorial: Model<any> = model("Tutorial", tutorialSchema);

export default Tutorial;
