import { Request, Response } from "express";
import { HouseController } from "./../controllers/HouseController";

export class Routes {

  public houseController: HouseController = new HouseController();

  public routes(app: any): void {
    app.route('/get').get(this.houseController.gethouse)
    app.route('/add').post(this.houseController.addHouse)
    app.route('/all').get(this.houseController.getAllHouse)
    app.route('/user/:userId').get(this.houseController.getUserHouse)
    app.route('/all').delete(this.houseController.deleteHouse)
  }

}




