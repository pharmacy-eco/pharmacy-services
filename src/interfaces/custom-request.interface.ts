import { Users } from '../entity/users.entity';
import { Request } from 'express';

export interface CustomRequest extends Request {
    user?: Users;
}
