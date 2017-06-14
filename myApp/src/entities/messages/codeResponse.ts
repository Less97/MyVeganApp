
import { iResponseLoader } from "../interfaces/iResponseLoader";

export class CodeResponse implements iResponseLoader<CodeResponse>{
 

  error: boolean;
  code:string;

  constructor(){
  }

  fromResponse(json: string): CodeResponse {
     var obj = Object.create(CodeResponse);
     var data = JSON.parse(json);
     obj.error = data.error;
     obj.code = data.GeneratedCode;
     return obj;
  }

}