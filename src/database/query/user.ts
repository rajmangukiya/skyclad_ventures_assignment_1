import BaseUser, { IBaseUser } from "../models/BaseUser";
import { UserRole } from "../types";

export const createUser = async (userData: {
  name: string;
  email: string;
  role: UserRole;
}): Promise<IBaseUser> => {
  try {
    const user = new BaseUser(userData);
    return await user.save();
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<IBaseUser | null> => {
  try {
    return await BaseUser.findOne({ email });
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (): Promise<IBaseUser[]> => {
  try {
    return await BaseUser.find();
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IBaseUser | null> => {
  try {
    return await BaseUser.findById(id);
  } catch (error) {
    throw error;
  }
};