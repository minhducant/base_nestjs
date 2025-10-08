import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'

import { UploadService } from './upload.service'

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly filesService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.saveFile(file)
  }
}
