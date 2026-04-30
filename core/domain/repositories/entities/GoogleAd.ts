export class GoogleAd {
  public readonly id?: string;

  public adUnitPath: string;
  public slotId: string;
  public enabled: boolean;
  public adminEmail?: string;

  constructor(props: {
    id?: string;
    adUnitPath: string;
    slotId: string;
    enabled?: boolean;
    adminEmail?: string;
  }) {
    this.id = props.id;
    this.adUnitPath = props.adUnitPath;
    this.slotId = props.slotId;
    this.enabled = props.enabled ?? true;
    this.adminEmail = props.adminEmail;
  }
}