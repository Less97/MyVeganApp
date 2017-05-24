


export class LoginService {
  private address = 'http://thecuriouscarrot.com/api/';

  constructor(private http: Http){

    
  }

  Login(eml, pwd, callback) {
     var req = {
          url: this.address + "users/login",
          data: {
            email: eml,
            password: pwd
          },
          method: 'POST',
          headers: {
            'Content-Type': "application/json"
          }
        }
        $http(req).success(function (data) {
          data = JSON.parse(data);
          if (data.isLoggedIn)
            window.localStorage.setItem( 'loginData', JSON.stringify(data));
          
          callback(data.isLoggedIn);

        }).error(function () {
          callback(false);
        })
  }

  IsLogged() {
    var data = JSON.parse(window.localStorage.getItem('loginData'));
    if (data == null)
      return false;
    return data.isLoggedIn;
  }
  Logout() {
    window.localStorage.setItem('loginData', '');
  }

}
