import { ReadModel } from "./ReadModel";

export interface Note extends ReadModel {
    note_url: string;
    note_link: string;
};
