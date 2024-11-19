import {Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller('stock')
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get(':symbol')
    async getStock(@Param('symbol') symbol: string): Promise<any> {
        try {
            return await this.appService.getQuote(symbol);
        } catch (error) {
            throw new HttpException(error.message, error.getStatus ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(':symbol')
    async initStockCheck(@Param('symbol') symbol: string): Promise<any> {
        try {
            return this.appService.addInterval(symbol);
        } catch (error) {
            throw new HttpException(error.message, error.getStatus ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
