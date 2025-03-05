export class UserModel{
    id?:string;
    userName: string = "";
    password: string = "";
    avatar?:string;
    xp:number = 0;
    level:number = 0;
    skillInfo:any;
    todos:any;
}