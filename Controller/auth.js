import { StatusCodes } from "http-status-codes";
import prisma from '../db/prisma.js';
import crypto from 'crypto';
import UnauthenticatedError from "../ErrorClass/unauthenticated.js";
import BadRequestError from "../ErrorClass/bad-request.js";


const createApiKey = (email) => {
    const apiKey = crypto.randomBytes(32).toString('hex');

    const emailEncoded = encodeURIComponent(email);
    const url = `https://formPolit.org/api/${emailEncoded}`;
    return { apiKey, url };
};

//  desc: login or register user and store user in table                    route: /api/auth
export const login = async (req, res) => {
    const { email, image, name } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(StatusCodes.OK).json(existingUser);
    } else {
        const { apiKey, url } = createApiKey(email);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                image,
                secretKeys: {
                    apiKey,
                    url,
                },
            },
        });

        return res.status(StatusCodes.CREATED).json(newUser);
    }
};

//  desc: recharge user credits or gives error              route: /api/auth/email

export const recharge = async (req, res) => {
    const { email, subject } = req.body;

    if (!email || !subject) {
        throw new BadRequestError('Email and subject are required');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
        throw new UnauthenticatedError('Only authenticated users can recharge their account');
    }

    if (existingUser.credits > 0) {
        throw new BadRequestError('Use all your credits to get new ones');
    }

    if (existingUser.requests >= 1) {
        throw new BadRequestError('Your free quote for recharge is over');
    }

    const updatedUser = await prisma.user.update({
        where: { email },
        data: {
            credits: 4,
            requests: { increment: 1 },
        },
    });

    res.status(StatusCodes.OK).json({
        message: 'Recharge successful! You received 4 extra credits.',
        credits: updatedUser.credits,
    });
};