export class Testimonial {
    constructor(
        public institutionId: string,
        public name: string,
        public content: string,
        public role?: string,
        public photo?: string,
        public id?: string,
        public createdAt?: string,
        public updatedAt?: string
    ) { }
}