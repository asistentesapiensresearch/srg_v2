export class Section {
  public readonly id: string;

  public name: string;
  public description: string;
  public icon: string;

  constructor(props: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.icon = props.icon;
  }
}