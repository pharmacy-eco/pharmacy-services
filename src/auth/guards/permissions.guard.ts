import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        console.log(user);

        // const foundPermission = await this.permissionService.findByField('code', requiredPermissions.join(', '));
        // if (!foundPermission) return false;

        // const foundUser = await this.roleHasPermissionService.getPermissionByRoleId(user.role, foundPermission.id);
        // if (!foundUser) return false;

        return true;
    }
}
