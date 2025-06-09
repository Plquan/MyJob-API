import IUserService from "@/interfaces/user/IUserService";
import { DELETE, GET, POST, route } from "awilix-express";
import { Response,Request } from "express";

@route('/user')
export class UserController {
    private readonly _userService: IUserService

    constructor(UserService: IUserService) {
        this._userService = UserService;
    }

    @POST()
    @route("/get-all-users")
    async getAllUsers(req: Request, res: Response){
        const data = req.body;
        const response = await this._userService.getAllUsers(data);
        return res.status(response.status).json(response);
    }

    @GET()
    @route("/get-user/:userId")
    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.userId);
        const response = await this._userService.getUserById(userId);
        return res.status(response.status).json(response);
    }

    // @POST()
    // @route("/update-user-avatar/:userId")
    // async updateUserAvatar(req: Request, res: Response) {
    //     const file = req.file;
    //     const response = await this._userService.updateUserAvatar(file);
    //     return res.status(response.status).json(response);
    // }
    @POST()
    @route("/update-user")
    async updateUser(req: Request, res: Response) {
        const data = req.body;
        const response = await this._userService.updateUser(data);
        return res.status(response.status).json(response);
    }

    @POST()
    @route("/create-user")
    async createUser(req: Request, res: Response) {
        const data = req.body;
        const response = await this._userService.createUser(data);
        return res.status(response.status).json(response);
    }
    @DELETE()
    @route("/delete-user/:userId")
    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.userId);
        const response = await this._userService.deleteUser(userId);
        return res.status(response.status).json(response);
    }


 }