export class Brand {
  public readonly id?: string;

  public index?: string;
  public name: string;
  public link: string;
  public key: string;

  constructor(props: {
    index: string;
    name: string;
    link: string;
    key: string;
  }) {
    this.index = props.index;
    this.name = props.name;
    this.link = props.link;
    this.key = props.key;
  }
}