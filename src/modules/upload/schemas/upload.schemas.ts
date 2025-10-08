import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'files' })
@Schema()
export class Upload {
  @Prop({ required: false })
  customeId: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;
}

export type UploadDocument = Upload & Document;
export const UploadSchema = SchemaFactory.createForClass(Upload);