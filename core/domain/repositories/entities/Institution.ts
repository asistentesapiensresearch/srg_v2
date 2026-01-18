import { InstitutionType, InstitutionSubtype } from '../../types/InstitutionTypes';

export class Institution {
  public readonly id: string;

  public name: string;
  public type: InstitutionType;
  public subtype?: InstitutionSubtype; // Optional, for more detail

  public landingData: Record<string, any>;

  constructor(props: {
    id: string;
    name: string;
    type: InstitutionType;
    subtype?: InstitutionSubtype;
    landingData: Record<string, any>;
    researchIds: string[];
  }) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.subtype = props.subtype;
    this.landingData = props.landingData;
  }
}