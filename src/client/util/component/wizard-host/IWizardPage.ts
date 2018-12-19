/**
 * Wizard page interface.
 *
 * @author Dragos Sebestin
 */
export interface IWizardPage {
  pageId: string,
  title: string,

  hide () : void;
  show () : void;
  isHidden () : boolean;
}
