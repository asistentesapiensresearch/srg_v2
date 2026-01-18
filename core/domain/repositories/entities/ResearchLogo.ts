export class ResearchLogo {
  public readonly id?: string;

  public researchId: string;
  public logoId: string;

  constructor(props: {
    researchId: string;
    logoId: string;
  }) {
    this.researchId = props.researchId;
    this.logoId = props.logoId;
  }
}