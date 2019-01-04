export = Multipart;


declare class Multipart {
    constructor(config?: Multipart.Config);


    submit(url: string): Promise<any>;
    convertToBuffer():ArrayBuffer;
    field(field:Multipart.Field):void;
    file(file:Multipart.File):void;
}

declare namespace Multipart {
  export interface Config {
    fields?: Field[];
    files?: File[];
  }
  export interface Field{
    name:string;
    value:string;
  }
  export interface File{
    filePath:string;
    filename?:string;
    name?:string;
  }
}