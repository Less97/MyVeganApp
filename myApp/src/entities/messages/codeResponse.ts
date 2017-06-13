
import { iResponseLoader } from "../interfaces/iResponseLoader";

export class CodeResponse implements iResponseLoader<CodeResponse>{
 

  error: boolean;
  code:string;

  constructor(){
  }

  fromResponse(json: string): CodeResponse {
     var obj = Object.create(CodeResponse);
     var data = JSON.parse(json);
     this.error = data.error;
     this.code = data.code;
     return obj;
  }

}