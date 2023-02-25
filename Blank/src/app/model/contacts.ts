import { NamePayload } from "./namePayload";
import { Phone } from "./phone";

export interface Contact {
    db: any,
    name: NamePayload;
    phone: Phone;
  }