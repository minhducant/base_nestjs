import { Model } from 'mongoose'
import { extname, join } from 'path'
import * as fsExtra from 'fs-extra'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { existsSync, mkdirSync, writeFile } from 'fs'

import { Upload, UploadDocument } from './schemas/upload.schemas'

@Injectable()
export class UploadService {
  constructor(@InjectModel(Upload.name) private fileModel: Model<UploadDocument>) {}

  private async getUniqueFileName(originalName: string): Promise<string> {
    const fileExtName = extname(originalName)
    const baseName = originalName.replace(fileExtName, '')
    let newFileName = originalName
    let counter = 1
    while (await this.fileModel.findOne({ filename: newFileName }).exec()) {
      newFileName = `${baseName}(${counter++})${fileExtName}`
    }
    return newFileName
  }

  async saveFile(file: Express.Multer.File) {
    const uploadsPath = '/var/www/ecomove/uploads/'
    const fileName = file.originalname
    const filePath = join(uploadsPath, fileName)
    if (!existsSync(uploadsPath)) {
      mkdirSync(uploadsPath, { recursive: true })
    }
    const uniqueFileName = await this.getUniqueFileName(fileName)
    const uniqueFilePath = join(uploadsPath, uniqueFileName)
    fsExtra.writeFile(uniqueFilePath, file.buffer, (err) => {
      if (err) {
        throw new Error('Failed to save file')
      }
    })
    const newFile = new this.fileModel({
      filename: uniqueFileName,
      path: uniqueFilePath,
    })
    return newFile.save()
  }

  async getFileByCustomeId(customeId: string): Promise<UploadDocument> {
    return this.fileModel.findOne({ customeId }).exec()
  }
}
