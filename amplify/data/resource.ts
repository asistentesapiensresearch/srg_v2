import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

import { Institution } from './schemas/Institution';
import { Research } from './schemas/Research';
import { Brand } from './schemas/Brand';
import { ResearchBrand } from './schemas/ResearchBrand';
import { Template } from './schemas/Template';

const schema = a.schema({
  Institution,
  Research,
  Brand,
  ResearchBrand,
  Template
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
