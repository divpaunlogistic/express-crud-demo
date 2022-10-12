import { Request, Response } from "express";
import { AuthController } from "../../controllers/AuthController";

export class Routes {

  public authController: AuthController = new AuthController();

  public routes(app: any): void {
    app.route('/').get(this.authController.get);
    app.route('/').post(this.authController.checkAuth);

  }

}