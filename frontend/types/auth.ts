export interface IUser {
    _id: any;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
