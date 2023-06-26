import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';

declare global {
    var signup: () => string[];
} 

global.signup = (): string[] => {
    const email = 'test@test.com';
    const id = new mongoose.Types.ObjectId().toHexString();
    const payloda = {
        email,
        id
    }
    const token = sign(payloda, process.env.JWT_KEY!)
    const session = {jwt: token};
    const sessionJson = JSON.stringify(session)
    const base64 = Buffer.from(sessionJson).toString('base64');
    return [`session=${base64}`];
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'secret';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll( async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

