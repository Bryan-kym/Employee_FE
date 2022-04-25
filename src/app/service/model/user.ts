export class User {
	public userid: number;
	public firstName: string;
	public lastName: string;
	public username: string;
	public nid:  number;
	public mobile:  number;
	public password: string;
	public email: string;
	public department: string;
	public position: string;
	public profileImageUrl: string;
	public lastLoginDate: Date;
	public lastLoginDateDisplay: Date;
	public joinDate: Date;
	public roles: string;
	public authorities: [];
	public active: boolean;
	public notLocked: boolean;


    constructor(){
        this.authorities = [];
        this.department = '';
        this.email = '';
        this.firstName = '';
        this.active = false;
        this.notLocked = false;
        this.lastName = '';
        this.nid = 0;
        this.mobile = 0;
        this.password = '';
        this.position = '';
        this.profileImageUrl = '';
        this.roles= '';
        this.username = '';

   
    }
}