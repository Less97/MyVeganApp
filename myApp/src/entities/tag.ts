
export class Tag {
  _id: string;
  selected:boolean;

  constructor(id:string,isSelected:boolean = null){
    this._id = id;
    this.selected = isSelected;
  }
}