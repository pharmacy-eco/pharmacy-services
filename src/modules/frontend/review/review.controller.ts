import { Body, Controller, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { Public } from './../../../auth/decorators/jwt.decorators';
import { IRequestInfo } from '../../../common/types';
import { CreateDtoReview } from './DTO/create.dto';
import { ReviewsService } from './review.service';

@ApiTags('Frontend Review')
@Public()
@Controller('web/review')
@UseInterceptors(LoggingInterceptor)
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly responseService: ResponseService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Thêm mới đánh giá' })
    async create(@Body() payload: CreateDtoReview, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.reviewsService.create(payload);
        if (data) {
            return this.responseService.createResponse(
                201,
                'Thêm mới thành công',
                requestInfo.requestId,
                requestInfo.at,
                data,
            );
        } else {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }
}
