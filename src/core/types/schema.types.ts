
interface ValidateFileSchema {

    type: "file";
    validate?: (content: any) => boolean;
    required?: boolean;

}

interface ValidateDirectorySchema {

    type: "directory";
    children?: ValidateSchema;
    required?: boolean;

}

export type ValidateNode = ValidateFileSchema | ValidateDirectorySchema;
export type ValidateSchema = Record<string, ValidateNode>;

interface GenerateFileSchema {

    type: "file";
    content?: any;

}

interface GenerateDirectorySchema {
    
    type: "directory";
    children?: GenerateSchema;

}

export type GenerateNode = GenerateFileSchema | GenerateDirectorySchema;
export type GenerateSchema = Record<string, GenerateNode>;


