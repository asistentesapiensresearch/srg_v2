import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

import { Section } from './schemas/Section';
import { Institution } from './schemas/Institution';
import { Research } from './schemas/Research';

const schema = a.schema({
  Section,
  Institution,
  Research
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 365
    },
  },
});
