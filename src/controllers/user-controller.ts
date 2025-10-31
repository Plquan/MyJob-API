import IUserService from "@/interfaces/user/user-interface";
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express";
import { Response, Request } from "express";
import { Auth } from "@/common/middlewares";
@route('/user')
export class UserController {
    private readonly _userService: IUserService
    constructor(UserService: IUserService) {
        this._userService = UserService;
    }

    @POST()
    @route("/get-all-users")
    @before(inject(Auth.required))
    async getAllUsers(req: Request, res: Response) {
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

    @PUT()
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