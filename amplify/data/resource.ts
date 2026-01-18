import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

import { Section } from './schemas/Section';
import { Institution } from './schemas/Institution';
import { Research } from './schemas/Research';
import { Logo } from './schemas/Logo';
import { ResearchLogo } from './schemas/ResearchLogo';
import { Template } from './schemas/Template';

const schema = a.schema({
  Section,
  Institution,
  Research,
  Logo,
  ResearchLogo,
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
