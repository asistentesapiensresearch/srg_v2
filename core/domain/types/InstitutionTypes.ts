/**
 * Defines the main categories of institutions.
 */
export enum InstitutionType {
    Educational = 'EDUCATIONAL',
    Organizational = 'ORGANIZATIONAL',
    Other = 'OTHER'
}

/**
 * Defines subtypes, especially for the main categories.
 * You can nest as many as you need.
 */
export type InstitutionSubtype =
    | 'university'
    | 'school'
    | 'ngo'
    | 'governmental'
    | 'private'
    | 'public';

// /core/domain/types/ChartData.ts
/**
 * Standard structure expected by your front-end charting library.
 * (Example for Chart.js)
 */
export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
    }[];
}

// /core/domain/types/DateRange.ts
/**
 * A simple Value Object for handling time ranges.
 */
export interface DateRange {
    start: Date;
    end: Date;
}