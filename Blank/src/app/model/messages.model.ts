import { UserFully } from "./receiver.model";

export interface Message {
    createdAt: string;
    file: string;
    isFile: boolean;
    message: string;
    read: boolean;
    receiver: UserFully;
    sender: UserFully;
    recipient_type: string;
}