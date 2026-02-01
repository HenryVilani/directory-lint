
export class InvalidLint extends Error {

    constructor(path: string) {
        super(`Invalid Lint detected in path: ${path}`);
    }

}

export class NotFoundRequiredItem extends Error {

    constructor(item: string) {
        super(`Not found required item: ${item}`);
    }

}

export class InvalidItemType extends Error {

    constructor(item: string) {
        super(`Invalid item type (file or dir): ${item}`);
    }

}
