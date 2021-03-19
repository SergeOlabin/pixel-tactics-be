import { Schema } from 'mongoose';

export const CatSchema = new Schema({
  name: String,
  age: Number,
  breed: {
    type: String,
    required: false,
  },
});

export class Cat {
  name: string;
  age: number;
  breed?: string;
}
