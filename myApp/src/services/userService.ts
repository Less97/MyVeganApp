import { Injectable } from  '@angular/core';
import { ConfigsProvider } from '../providers/configsProvider'
import { Http } from '@angular/http'
import { UserData } from '../entities/userData'
import { CodeResponse } from '../entities/messages/codeResponse';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private serviceUrl:string;

  constructor(private http: Http, private configs:ConfigsProvider) {
    this.serviceUrl = configs.serviceURL;
  }
  

  public login(eml:string,pwd:string):Observable<UserData>{
     return this.http.post(this.serviceUrl+'users/login',{email:eml,password:pwd})
     .map(res=> new UserData().fromResponse(res.json()))
  }

  public register(name:string,surname:string,eml:string,password:string):Observable<CodeResponse>{
    return this.http.post(this.serviceUrl+'users/register',{
      firstName: name,
      lastName: surname,
      email: eml,
      password: password,
      type:0
    }).map(res=> new CodeResponse().fromResponse(res.json()))
  }

  public loginViaFacebook(firstName:string,lastName:string,email:string,userId:string){
    return this.http.post(this.serviceUrl+'users/loginViaFacebook',
    {
      FirstName:firstName,
      LastName:lastName,
      Email:email,
      UserId:userId,
      IsFacebookLogin:true
    })
  }


  public confirmCode(eml:string):Observable<{error:boolean}>{
    return this.http.post(this.serviceUrl+'users/confirmEmail',{
      email:eml
    }).map(res=>{
      var body = JSON.parse(res.json());
      return new Object({error:body.Error});
    });
  }

  public restorePassword(eml:string):Observable<{error:boolean,code:string}>{
    return this.http.post(this.serviceUrl+'users/restorePassword',{
      email:eml
    }).map(res=>{
      var body = JSON.parse(res.json());
      return new Object({error:body.Error,code:body.GeneratedCode});
    })
  }

  public changePassword(eml:string,pwd:string):Observable<{error:boolean}>{
      return this.http.post(this.serviceUrl+'users/changePassword',{
        email:eml,
        password:pwd
      }).map(res=>{
        var body = JSON.parse(res.json())
        return new Object({error:body.Error});
      })
  }

}
