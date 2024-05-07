import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
enum role {
    admin = "ADMIN",
    engineer = "ENGINEER",
    intern = "INTERN"
}


export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: role;
}
export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    role: role;
    id: any;
}
export const UserSchema = SchemaFactory.createForClass(User);