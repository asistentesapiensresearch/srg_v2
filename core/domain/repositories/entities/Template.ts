// core/domain/repositories/entities/Template.ts
export class Template {
  public readonly id: string;

  public themeSettings: string;
  public researchId: string;
  public articleId: string;
  public institutionId: string;

  constructor(props: {
    themeSettings: string;
    researchId: string;
  }) {
    this.themeSettings = props.themeSettings;
    this.researchId = props.researchId;
  }
}