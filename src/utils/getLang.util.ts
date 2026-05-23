// import { BadRequestException } from '@nestjs/common';

// export function getLangcode(req: any) {
//     const reqLangCode = req.lang_code;
//     let langCode = '';
//     if (reqLangCode && reqLangCode === 'VI') {
//         langCode = reqLangCode;
//     } else if (reqLangCode && reqLangCode === 'EN') {
//         langCode = reqLangCode;
//     } else if (reqLangCode == '') {
//         return process.env.FALLBACK_LANG_FRONTEND;
//     } else {
//         throw new BadRequestException(`Mã ngôn ngữ không hợp hệ hoặc không tồn tại!`);
//     }

//     return langCode;
// }
