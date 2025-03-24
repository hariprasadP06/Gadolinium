import { createHash } from "crypto";

import { SignUpWithUsernameAndPasswordError, type SignUpWithUsernameAndPasswordResult } from "./+type";
import { prismaClient } from "../../extras/prisma";
import { sign, type JwtPayload } from "jsonwebtoken";
import { jwtSecretKey } from "../../../environment";

export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        username: parameters.username,
      },
    });

    if (existingUser) {
      throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    const passwordHash = createHash("sha256").update(parameters.password).digest("hex");

    const user = await prismaClient.user.create({
      data: {
        username: parameters.username,
        password: passwordHash,
      },
    });

    // Generate token
    const jwtPayload: JwtPayload = {
      iss: "https://purpleshorts.co.in",
      sub: user.id,
      username: user.username,
    };

    const token = sign(jwtPayload, jwtSecretKey, {
      expiresIn: "30d",
    });

    const result: SignUpWithUsernameAndPasswordResult = {
      token,
      user,
    };

    return result;
  } catch (e) {
    console.log("Error", e);
    throw SignUpWithUsernameAndPasswordError.UNKNOWN;
  }
};