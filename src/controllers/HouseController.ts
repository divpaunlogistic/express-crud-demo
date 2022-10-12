import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "./../middleware/auth";
import House, { IHouse } from "./../models/House";
import Request from "./../types/Request";
import User, { IUser } from "./../models/User";

export class HouseController {
  
    public async gethouse(req: Request, res: Response) {
        try {
    
            const house: IHouse = await House.findOne({
              owner: req.userId,
            }).populate("user", ["avatar", "email"]);
            
            if (!house) {
              return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors: [
                  {
                    msg: "There is no house for this user",
                  },
                ],
              });
            }
        
            res.json(house);
          } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
          }
    }
    public async addHouse(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(HttpStatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() });
        }
    
        const { name } = req.body;
    
        // Build profile object based on IProfile
        const houseFields = {    
          owner: req.userId,
          name
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
    
          // Create
          let house = new House(houseFields);
    
          await house.save();
    
          if(req.userId)
          {
            await User.findByIdAndUpdate(
              req.userId,
              { $push: { houses: house._id } },
              { new: true, useFindAndModify: false }
            );
          }
    
          res.json(house);
        } catch (err) {
          console.error(err.message);
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
    public async getAllHouse(req: Request, res: Response) {
        try {
            const houses = await User.find().populate("houses");
            
            res.json(houses);
          } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
          }
    }
    public async getUserHouse(req: Request, res: Response) {
        try {
            const book: IHouse = await House.findOne({
              user: req.params.userId,
            }).populate("user", ["avatar", "email"]);
        
            if (!book)
              return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ msg: "House not found" });
        
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
    }
    public async deleteHouse(req: Request, res: Response) {
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
    }
    
}