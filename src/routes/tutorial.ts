import { Request, Response } from "express";
import { TutorialController } from "./../controllers/TutorialController";

export class Routes {

  public tutorialController: TutorialController = new TutorialController();

  public routes(app: any): void {
    app.route('/get').get(this.tutorialController.getTutorials)
    app.route('/add').post(this.tutorialController.addTutorialWithTags)
    app.route('/all').get(this.tutorialController.getAllTutorials)
    app.route('/').delete(this.tutorialController.deleteTutorial)
  }

}
