export class ResearchBrand {
  public readonly id?: string;

  public researchId: string;
  public brandId: string;

  constructor(props: {
    researchId: string;
    brandId: string;
  }) {
    this.researchId = props.researchId;
    this.brandId = props.brandId;
  }
}