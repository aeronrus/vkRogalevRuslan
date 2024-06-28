import { ArrayErrors } from '../exceptions/api-error';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  coverPic?: string;
  profilePic?: string;
  city?: string;
  website?: string;
  isActivated: boolean;
  activationLink: string;
};

export function checkAndReturnString(value: any): string {
  if (value) {
    return value as string;
  } else {
    throw new Error('Значение отсутствует');
  }
}
export type ModelUserDtoType = {
  id: number;
  email: string;
  IsActivated: boolean | null;
};

export interface errInterface {
  status: number;
  message: string;
  errors: ArrayErrors[] | undefined;
}
export interface reqInterface {}
