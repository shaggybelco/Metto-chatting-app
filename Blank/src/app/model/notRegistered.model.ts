import { NamePayload } from './namePayload.model';
import { Phone } from './phone.model';

export interface ContactPayload {
  contactId?: string;
  name?: NamePayload;
  phones?: Phone[];
}
