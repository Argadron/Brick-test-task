export interface templateObject {
    readonly email: string;

    readonly action: string;

    readonly url: string;
}

export interface EmailOptions {
    readonly to: string;

    readonly subject: string;

    readonly text: string;

    readonly templateObject: templateObject;
}

export interface CreateTag {
    readonly userId: number;

    readonly urlTag: string;
}