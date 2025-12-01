import { IUser } from "../../models/user.model";
import { IBaseRepository } from "./base.Irepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null | never>;
  verifyUser(
    email: string,
    is_verified: boolean
  ): Promise<IUser | null | never>;
}
