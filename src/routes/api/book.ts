import { Request, Response } from "express";
import { BookController } from "../../controllers/BookController";

export class Routes {

  public bookController: BookController = new BookController();

  public routes(app: any): void {
    app.route('/get').get(this.bookController.getBook)
    app.route('/add').post(this.bookController.addBook)
    app.route('/all').get(this.bookController.getAllBook)
    app.route('/user/:userId').get(this.bookController.getUserBook)
    app.route('/all').delete(this.bookController.deleteBook)
  }

}
