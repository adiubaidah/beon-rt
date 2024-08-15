import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";


export async function comparePassword(password: string, hashedPassword: string) {
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
}

export function generateAccessToken(user: User) {
    const {username} = user
    const payloadUser = {username}
    return jwt.sign(payloadUser, process.env.SECRET_KEY as string, { expiresIn: '1d' })
}

export function generateString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}