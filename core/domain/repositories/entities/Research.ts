import { DateRange } from '../../types';

export class Research {
    public readonly id?: string; // UUID - opcional para creación
    public readonly sectionId: string; // ID of the parent Section

    public index: number;
    public title: string;
    public shortDescription: string;
    public description: string;
    public alert?: string;
    public dateRange?: string; // En Amplify es string, no DateRange
    public path?: string;
    public icon?: string;
    public version: number;

    // Relaciones
    public template?: any; // hasOne Template
    public logos?: any[]; // hasMany ResearchLogo

    constructor(props: {
        id?: string;
        sectionId: string;
        title: string;
        shortDescription: string;
        description: string;
        alert?: string;
        dateRange?: string;
        path?: string;
        icon?: string;
        version?: number;
        template?: any;
        logos?: any[];
    }) {
        this.id = props.id;
        this.sectionId = props.sectionId;
        this.title = props.title;
        this.shortDescription = props.shortDescription;
        this.description = props.description;
        this.alert = props.alert;
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
            this.shortDescription &&
            this.sectionId &&
            this.index !== undefined &&
            this.index !== null
        );
    }
}