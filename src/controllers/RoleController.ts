import IRoleService from "@/interfaces/role/IRoleService";
import { Request,Response } from "express";
import { DELETE, GET, POST, PUT, route } from "awilix-express";

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
    @route("/get-roles")
    async getAllRoles(req: Request, res: Response) {
       const response = await this._roleService.getAllRoles()
       return res.status(response.status).json(response) 
    }

    @POST()
    @route("/create-role")
    async createRole(req: Request, res: Response) {
        const data = req.body;
        const response = await this._roleService.createRole(data);
        return res.status(response.status).json(response);
    }

    @PUT()
    @route("/update-role")
    async updateRole(req: Request, res: Response) {
        const data = req.body;
        const response = await this._roleService.updateRole(data);
        return res.status(response.status).json(response);
    }
    @DELETE()
    @route("/delete-role/:roleId")
    async deleteRole(req: Request, res: Response) {
        const roleId = parseInt(req.params.roleId);
        const response = await this._roleService.deleteRole(roleId);
        return res.status(response.status).json(response);
    }
    @POST()
    @route("/update-role-permissions")
    async updateRolePermissions(req: Request, res: Response) {
        const data = req.body;
        const response = await this._roleService.updateRolePermissions(data);
        return res.status(response.status).json(response);
    }
    
}