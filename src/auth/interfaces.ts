export interface JwtUser {
    readonly id: number;
    readonly role: string;
    readonly isBanned: boolean;
}