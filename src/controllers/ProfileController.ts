import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "./../middleware/auth";
import Profile, { IProfile } from "./../models/Profile";
import Request from "./../types/Request";
import User, { IUser } from "./../models/User";

export class ProfileController {
  
    public async getProfile(req: Request, res: Response) {
        try {
            const profile: IProfile = await Profile.findOne({
              user: req.userId,
            }).populate("user", ["avatar", "email"]);
            if (!profile) {
              return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors: [
                  {
                    msg: "There is no profile for this user",
                  },
                ],
              });
            }
        
            res.json(profile);
          } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
          }
    }
    public async addProfile(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(HttpStatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() });
        }
    
        const { firstName, lastName, username } = req.body;
    
        // Build profile object based on IProfile
        const profileFields = {
          user: req.userId,
          firstName,
          lastName,
          username,
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
    
          let profile: IProfile = await Profile.findOne({ user: req.userId });
          if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
              { user: req.userId },
              { $set: profileFields },
              { new: true }
            );
    
            return res.json(profile);
          }
    
          // Create
          profile = new Profile(profileFields);
    
          await profile.save();
    
          res.json(profile);
        } catch (err) {
          console.error(err.message);
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }

    }
    
}