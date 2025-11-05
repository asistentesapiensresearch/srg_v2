export class Section {
  public readonly id: string;

  public name: string;
  public icon: string;

  constructor(props: {
    id: string;
    name: string;
    icon: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.icon = props.icon;
  }
}