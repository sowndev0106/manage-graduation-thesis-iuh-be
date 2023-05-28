import { NextFunction, Request, Response } from "express";
import Ioc from "@lecturer/infrastructure/inversify";
import GetGroupByIdHandler from "../handlers/group/GetGroupByIdHandler";
import GetListGroupHandler from "../handlers/group/GetListGroupHandler";
import GetListGroupByGroupLecturerHandler from "../handlers/group/GetListGroupByGroupLecturerHandler";
import GrantTopicGroupHandler from "../handlers/group/GrantTopicGroupHandler";

class GroupController {
  async getGroupById(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GetGroupByIdHandler).handle(req);
    return res.status(200).json(data);
  }
  async getListGroup(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GetListGroupHandler).handle(req);
    return res.status(200).json(data);
  }
  async grantTopicGroup(req: Request, res: Response, next: NextFunction) {
    const data = await Ioc.get(GrantTopicGroupHandler).handle(req);
    return res.status(200).json(data);
  }

  async getListGroupByGroupLecturer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const data = await Ioc.get(GetListGroupByGroupLecturerHandler).handle(req);
    return res.status(200).json(data);
  }
}
export default new GroupController();
