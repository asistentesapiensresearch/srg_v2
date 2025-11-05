import { DateRange } from '../types';

export class Research {
    public readonly id: string; // UUID
    public readonly sectionId: string; // ID of the parent Institution

    public title: string;
    public description: string;

    public dateRange?: DateRange;

    public dataSourceId: string;

    constructor(props: {
        id: string;
        sectionId: string;
        title: string;
        description: string;
        dateRange?: DateRange;
        dataSourceId: string;
    }) {
        this.id = props.id;
        this.sectionId = props.sectionId;
        this.title = props.title;
        this.description = props.description;
        this.dateRange = props.dateRange;
        this.dataSourceId = props.dataSourceId;
    }
}