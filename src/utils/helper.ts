import { Response } from "express";

export const setCookie = (res: Response, key: string, value: string, maxAge: number) => {
    res.cookie(key, value, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "none",
        maxAge: maxAge
    });
};