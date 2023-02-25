import { NamePayload } from './namePayload';
import { Phone } from './phone';

export interface ContactPayload {
  contactId?: string;
  name?: NamePayload;
  phones?: Phone[];
}
