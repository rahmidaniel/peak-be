import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ScheduleModule} from '@nestjs/schedule';
import {ConfigModule} from '@nestjs/config';
import {ConfigService} from "./config/config.serice";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule {
}
