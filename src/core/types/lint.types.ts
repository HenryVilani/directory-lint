
export interface GenerateOptions {

    overwrite?: boolean;
    recursive?: boolean;

}

export interface ValidateOptions {

    ignore: string[];

}

export interface ValidationResult {

    valid: boolean;

    errors: Array<{ path: string; message: string; type: "missing" | "invalid-type" | "custom" }>;
    warnings: Array<{ path: string; message: string }>;

}

export interface GenerationResult {

    warnings: Array<{ path: string; message: string; type: "missing"}>;

}