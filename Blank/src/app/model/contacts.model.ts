import { NamePayload } from "./namePayload.model";
import { Phone } from "./phone.model";

export interface Contact {
    [x: string]: any;
    // cellphone?: any;
    db: any,
    name: NamePayload;
    phone: Phone;
  }