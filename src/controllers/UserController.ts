import IUserService from "@/interfaces/user/IUserService";
import { GET, route } from "awilix-express";
import { Response,Request } from "express";

@route('/user')
export class UserController {
    private readonly _userService: IUserService

    constructor(UserService: IUserService) {
        this._userService = UserService;
    }

    @GET()
    @route("/get-all-users")
    async getAllUsers(req: Request, res: Response){
        const response = await this._userService.getAllUsers();
        return res.status(response.status).json(response);
    }

    @GET()
    @route("/get-user/:userId")
    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.userId);
        const response = await this._userService.getUserById(userId);
        return res.status(response.status).json(response);
    }

 }