export interface GalleryImage {
    original: string;
    thumbnail: string;
    description?: string;
}

export class Gallery {
    constructor(
        public name: string,
        public images: string | GalleryImage[], // Puede ser un JSON stringificado o el array de objetos
        public id?: string,
        public description?: string,
        public type?: string,
        public entityId?: string,
        public createdAt?: string,
        public updatedAt?: string
    ) { }
}