
export class RegexNotSupported extends Error {

    constructor(value: string) {
        super(`${value}: Regex not supported in GenerateSchema`);
    }

}

export class InvalidStructure extends Error {

    constructor(path: string) {
        super(`${path}: Invalid structured`);
    }

}

export class InvalidContent extends Error {

    constructor(path: string) {
        super(`${path}: Invalid content`);
    }

}
