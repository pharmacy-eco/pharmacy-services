import {
    Controller,
    Get,
    Post,
    HttpStatus,
    UseInterceptors,
    Query,
    Param,
    Body,
    UsePipes,
    Delete,
    Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { IRequestInfo } from '../../../common/types';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { ReviewsService } from './reviews.service';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';

@ApiTags('Quản lý đánh giá')
@Controller('reviews')
@UseInterceptors(LoggingInterceptor)
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu đánh giá' })
    async findAll(@Query() payload: FilterReviewsDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.reviewsService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Lấy danh sách thành công',
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

    @Get(':id')
    @ApiOperation({ summary: 'Chi tiết đánh giá' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.reviewsService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'đánh giá không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            200,
            'Chi tiết đánh giá',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới đánh giá' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createCategoryDto: CreateReviewsDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.reviewsService.create(createCategoryDto);
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

    @Put('status/:id')
    @ApiOperation({ summary: 'Cập nhật trạng thái đánh giá' })
    async changeStatus(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const review = await this.reviewsService.findOne(id);
        if (!review) {
            return this.responseService.createResponse(
                404,
                'đánh giá không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        const data = await this.reviewsService.changeStatus(id);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Cập nhật trạng thái đánh giá thành công',
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

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa đánh giá' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.reviewsService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'đánh giá không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.reviewsService.delete(id);

        return this.responseService.createResponse(
            200,
            'Xóa đánh giá thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
