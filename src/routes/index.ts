import { Request, Response } from "express";
import { AuthController } from "./../controllers/AuthController";
import { BookController } from "./../controllers/BookController";
import { HouseController } from "./../controllers/HouseController";
import { TutorialController } from "./../controllers/TutorialController";
import { UserController } from "./../controllers/UserController";

export class Routes {

  public authController: AuthController = new AuthController();
  public bookController: BookController = new BookController();
  public houseController: HouseController = new HouseController();
  public userController: UserController = new UserController();
  public tutorialController: TutorialController = new TutorialController();

  public routes(app: any): void {
    app.route('/').get(this.authController.get);

    app.route('/api/auth').post(this.authController.checkAuth);
    app.route('/api/user').post(this.userController.addUser);

    //Books
    app.route('/api/book/get').get(this.bookController.getBook)
    app.route('/api/book/add').post(this.bookController.addBook)
    app.route('/api/book/all').get(this.bookController.getAllBook)
    app.route('/api/book/user/:userId').get(this.bookController.getUserBook)
    app.route('/api/book/all').delete(this.bookController.deleteBook)

    //House
    app.route('/api/house/get').get(this.houseController.gethouse)
    app.route('/api/house/add').post(this.houseController.addHouse)
    app.route('/api/house/all').get(this.houseController.getAllHouse)
    app.route('/api/house/user/:userId').get(this.houseController.getUserHouse)
    app.route('/api/house/all').delete(this.houseController.deleteHouse)

    //Tutorial
    app.route('/api/tutorial/get').get(this.tutorialController.getTutorials)
    app.route('/api/tutorial/add').post(this.tutorialController.addTutorialWithTags)
    app.route('/api/tutorial/all').get(this.tutorialController.getAllTutorials)
    app.route('/api/tutorial').delete(this.tutorialController.deleteTutorial)

  }

}