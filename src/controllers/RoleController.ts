import IRoleService from "@/interfaces/auth/IRoleService";
import { Request,Response } from "express";
import { GET, route } from "awilix-express";

@route('/role')
export class RoleController {
    private readonly _roleService:IRoleService
    
    constructor(RoleService:IRoleService){
        this._roleService = RoleService
    }

    @GET()
    @route("/get-functions")
    async getAllFunctions(req: Request, res: Response) {
       const response = await this._roleService.getAllFunctions()
       return res.status(response.status).json(response) 
    }

    @GET()
    @route("/get-groupRoles")
    async getAllGroupRoles(req: Request, res: Response) {
       const response = await this._roleService.getAllGroupRoles()
       return res.status(response.status).json(response) 
    }




}