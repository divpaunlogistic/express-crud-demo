import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import House, { IHouse } from "../../models/House";
import Tutorial, { ITutorial } from "../../models/Tutorial";
import Tag, { ITag } from "../../models/Tag";

import Request from "../../types/Request";
import User, { IUser } from "../../models/User";

const router: Router = Router();

// @route   GET api/book/get-book
// @desc    Get current user's profile
// @access  Private
router.get("/get", auth, async (req: Request, res: Response) => {
  try {
    
    // const house: IHouse = await House.findOne({
    //   owner: req.userId,
    // }).populate("user", ["avatar", "email"]);
    
    // if (!house) {
    //   return res.status(HttpStatusCodes.BAD_REQUEST).json({
    //     errors: [
    //       {
    //         msg: "There is no house for this user",
    //       },
    //     ],
    //   });
    // }

    //res.json(house);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/book
// @desc    Create or update user's book
// @access  Private
router.post(
  "/add",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("tag_name", "Tag name is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { title, tag_name } = req.body;


    try {
      // Create tutorial
      let tutorial = new Tutorial({title : title});

      await tutorial.save();

       // Create tag
       let tag = new Tag({name : tag_name, slug : tag_name});

       await tag.save();

      if(tutorial)
      {
        await Tutorial.findByIdAndUpdate(
            tutorial._id,
          { $push: { tags: tag._id } },
          { new: true, useFindAndModify: false }
        );
      }

      if(tag)
      {
        await Tag.findByIdAndUpdate(
            tag._id,
          { $push: { tutorials: tutorial._id } },
          { new: true, useFindAndModify: false }
        );
      }

      res.json({tutorial : tutorial, tag : tag});
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   GET api/book
// @desc    Get all books
// @access  Public
router.get("/all", async (_req: Request, res: Response) => {
  try {
    const tutorials = await Tutorial.find().populate("tags");
    
    res.json(tutorials);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


// @route   DELETE api/book
// @desc    Delete book and user
// @access  Private
router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    // Remove book
    await House.findOneAndRemove({ user: req.userId });
    // Remove user
    //await User.findOneAndRemove({ _id: req.userId });

    res.json({ msg: "House removed" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
