import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';


@Injectable()
export class PrismaService extends PrismaClient {

    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DIRECT_URL')
                }
            }
        })
    }
}
