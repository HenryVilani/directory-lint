
type MapValidateSchema<T> = {
  [K in keyof T]:
    T[K] extends { type: "file" }
      ? ValidateFileResult
      : T[K] extends { type: "directory"; children?: infer C }
        ? ValidateDirectoryResult & {
            children: C extends object ? MapValidateSchema<C> : undefined;
          }
        : never;
};

type ExtractChildren<T> =
  T extends { type: "directory"; children: infer C }
    ? C
    : never;

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

export interface ValidateResult<TSchema> {

    cwd: string;
    paths: MapValidateSchema<TSchema>;

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