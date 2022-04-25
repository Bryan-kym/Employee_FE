export class User {
    public id:  number;
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
	public profileImage: string;
	public lastLoginDate: Date;
	public lastLoginDateDisplay: Date;
	public joinDate: Date;
	public roles: string;
	public authorities: [];
	public isActive: boolean;
	public isNotLocked: boolean;


    constructor(){
        this.authorities = [];
        this.department = '';
        this.email = '';
        this.firstName = '';
        this.isActive = false;
        this.isNotLocked = false;
        this.lastName = '';
        this.nid = null;
        this.mobile = null;
        this.password = '';
        this.position = '';
        this.profileImage = '';
        this.roles= '';
        this.username = '';

   
    }
}