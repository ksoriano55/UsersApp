export interface IUsers{
    firestoreId?: string;
    UserId: string,
    UserName: string,
    Password: string,
    FirstName: string,
    LastName: string,
    Address: string,
    Phone: string,
    Email: string,
    Status: boolean,
    ConfirmPassword?: string
}