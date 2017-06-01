export class UserData {
  isLoggedIn: boolean;
  firstName: string;
  lastName: string;
  email: string;
  id: string;


  public FromJson(json: string): UserData {
    var obj = Object.create(UserData);
    var data = JSON.parse(json);

    return obj;
  }
}
