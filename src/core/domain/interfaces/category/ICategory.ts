import { IEntity } from '../base/IEntity';

export interface ICategory extends IEntity<string> {
    name: string;
    parentId: string | null;
    level: number;

    /* Relationship */
}
