import { NamePayload } from "./namePayload";
import { Phone } from "./phone";

export interface Contact {
    [x: string]: any;
    // cellphone?: any;
    db: any,
    name: NamePayload;
    phone: Phone;
  }