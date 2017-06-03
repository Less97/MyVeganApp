
export class InfoWindow{
    name:string;
    description:string;
    
    goToDetails():void{
        alert();
    }

    constructor(name:string,description:string,onclick:()=>void){
        this.name = name;
        this.description = description;
    }
}