
export interface GenerateOptions {

    overwrite?: boolean;
    recursive?: boolean;

}

export interface ValidateOptions {

    ignore: string[];

}

interface ValidateFileResult {

    type: "file";
    name: string;
    path: string;

}

interface ValidateDirectoryResult {

    type: "directory";
    name: string;
    path: string;
    children?: ValidatePathResult;

}

type ValidateNodeResult = ValidateFileResult | ValidateDirectoryResult;
type ValidatePathResult = Record<string, ValidateNodeResult>;

export interface ValidateResult {

    cwd: string;
    paths: ValidatePathResult;

}

interface GenerateFileResult {

    type: "file";
    path: string;

}

interface GenerateDirectoryResult {

    type: "directory";
    path: string;
    children?: GeneratePathResult;

}

type GenerateNodeResult = GenerateFileResult | GenerateDirectoryResult;
type GeneratePathResult = Record<string, GenerateNodeResult>;


export interface GenerateResult {

    cwd: string;
    paths: GeneratePathResult;

}