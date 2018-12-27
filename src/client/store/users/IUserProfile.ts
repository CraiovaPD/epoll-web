import { UserRole } from '../../types/users/IUser';

export interface IUserProfile {
  _id: string,
  phone: string,
  role: UserRole,
  firstname: string,
  lastname?: string
}
