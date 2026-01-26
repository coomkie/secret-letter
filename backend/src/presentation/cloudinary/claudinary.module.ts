
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../../infra/cloudinary/cloudinary.provider';
import { CloudinaryService } from '../../core/application/interfaces/services/cloudinary.service';

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}