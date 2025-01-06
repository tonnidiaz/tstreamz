import { IUser } from "@pkg/cmn/models/user";


export {};
declare global {
    namespace Express{
        interface Request {
            user: IUser | null;
          }
}
 
}