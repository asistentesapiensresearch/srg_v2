export class Research {
    public readonly id?: string; // UUID - opcional para creación

    public index: number;
    public title: string;
    public description: string;
    public category: string;
    public subCategory: string;
    public dateRange?: string; // En Amplify es string, no DateRange
    public path?: string;
    public icon?: string;
    public version: number;

    // Relaciones
    public template?: any; // hasOne Template
    public logos?: any[]; // hasMany ResearchLogo

    constructor(props: {
        id?: string;
        category: string;
        subCategory: string;
        title: string;
        description: string;
        dateRange?: string;
        path?: string;
        icon?: string;
        version?: number;
        template?: any;
        logos?: any[];
    }) {
        this.id = props.id;
        this.category = props.category;
        this.subCategory = props.subCategory;
        this.title = props.title;
        this.description = props.description;
        this.dateRange = props.dateRange;
        this.path = props.path;
        this.icon = props.icon;
        this.version = props.version || 1;
        this.template = props.template;
        this.logos = props.logos;
    }

    // Métodos útiles
    public updateVersion(): void {
        this.version += 1;
    }

    public isValid(): boolean {
        return !!(
            this.title &&
            this.description &&
            this.index !== undefined &&
            this.index !== null
        );
    }
}