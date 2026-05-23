import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: CustomRequest, res: Response, next: NextFunction) {
        // const lang = req.headers['x-lang'] || req.headers['X-Lang'];
        // const rule: string = req.headers['x-channel'] || req.headers['X-Channel'];
        // if (lang) {
        //     req['lang_code'] = lang;
        // }

        // if (rule) {
        //     req['rule'] = rule;
        // }

        next();
    }
}
