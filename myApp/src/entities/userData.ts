


export class UserData {
 
  isLoggedIn: boolean = false;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  id: string = '';

  constructor(){

  }

  fromResponse(json: string): UserData {
    var obj = Object.create(UserData);
    var data = JSON.parse(json);
    obj.isLoggedIn = data.isLoggedIn;

    if(!obj.isLoggedIn)
      return obj;
    
    obj.firstName = data.user.FirstName;
    obj.lastName = data.user.LastName;
    obj.email = data.user.Email;
    obj.id = data.user._id.$oid;
    return obj;
  }
}
