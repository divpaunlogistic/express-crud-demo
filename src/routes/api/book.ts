import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Book, { IBook } from "../../models/Book";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";

const router: Router = Router();

// @route   GET api/book/get-book
// @desc    Get current user's profile
// @access  Private
router.get("/get", auth, async (req: Request, res: Response) => {
  try {
    const book: IBook = await Book.findOne({
      user: req.userId,
    }).populate("user", ["avatar", "email"]);
    if (!book) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "There is no book for this user",
          },
        ],
      });
    }

    res.json(book);
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
    check("description", " Description is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    // Build profile object based on IProfile
    const profileFields = {
      user: req.userId,
      title,
      description
    };

    try {
      let user: IUser = await User.findOne({ _id: req.userId });

      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "User not registered",
            },
          ],
        });
      }

      let book: IBook = await Book.findOne({ user: req.userId });
      if (book) {
        // Update
        book = await Book.findOneAndUpdate(
          { user: req.userId },
          { $set: profileFields },
          { new: true }
        );

        return res.json(book);
      }

      // Create
      book = new Book(profileFields);

      await book.save();

      res.json(book);
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
    const books = await Book.find().populate("user", ["avatar", "email"]);
    console.log("books", books);
    
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/book/user/:userId
// @desc    Get profile by userId
// @access  Public
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const book: IBook = await Book.findOne({
      user: req.params.userId,
    }).populate("user", ["avatar", "email"]);

    if (!book)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Book not found" });

    res.json(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Profile not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   DELETE api/book
// @desc    Delete book and user
// @access  Private
router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    // Remove book
    await Book.findOneAndRemove({ user: req.userId });
    // Remove user
    await User.findOneAndRemove({ _id: req.userId });

    res.json({ msg: "Book removed" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
