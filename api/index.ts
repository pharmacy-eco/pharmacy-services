import { createNestApplication } from '../src/main';
import { NowRequest, NowResponse } from '@vercel/node';

let cachedApp = null;

export default async function handler(req: NowRequest, res: NowResponse) {
    if (!cachedApp) {
        const app = await createNestApplication();
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }

    return cachedApp(req, res);
}
