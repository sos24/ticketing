import mongoose from "mongoose";

import { Password } from "../services/Password";

interface UserAttrs {
    email: string,
    password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    },
    {
        toJSON: {
            transform(doc, ret, options) {
                ret.id = doc._id;
                delete ret.password;
                delete ret.__v;
                delete ret._id;
            },
        }
    }
);

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }
    done();
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };