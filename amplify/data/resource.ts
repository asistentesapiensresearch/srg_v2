import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

import { Institution } from './schemas/Institution';
import { Research } from './schemas/Research';
import { Brand } from './schemas/Brand';
import { Template } from './schemas/Template';
import { TemplateBrand } from './schemas/TemplateBrand';
import { listUsersFunction } from '../functions';
import { manageUserGroup } from '../functions/manageUserGroup/resource';
import { Gallery } from './schemas/Gallery';
import { Testimonial } from './schemas/Testimonial';
import { Article } from './schemas/Article';

const schema = a.schema({
  Institution,
  Research,
  Brand,
  Template,
  TemplateBrand,
  Gallery,
  Testimonial,
  Article,
  listCognitoUsers: a.query()
    .returns(a.json()) // Retornará el array de usuarios como JSON
    .handler(a.handler.function(listUsersFunction))
    .authorization(allow => [allow.authenticated()]),
  addUserToGroupMutation: a.mutation()
    .arguments({
      username: a.string().required(),
      groupName: a.string().required()
    })
    .returns(a.boolean())
    .handler(a.handler.function(manageUserGroup))
    .authorization(allow => [allow.groups(["Admin"])]),
  manageUserMutation: a.mutation() // Le cambié el nombre para que sea más genérico
    .arguments({
      username: a.string().required(),
      groupName: a.string(), // Opcional porque disable/enable no lo necesitan
      action: a.string().required() // 'add', 'remove', 'disable', 'enable'
    })
    .returns(a.boolean())
    .handler(a.handler.function(manageUserGroup))
    .authorization(allow => [allow.groups(["Admin"])]),
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
