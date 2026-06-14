import { a } from '@aws-amplify/backend';

export const Page = a.model({
    title: a.string().required(),
    slug: a.string().required(),
    summary: a.string(),
    coverImage: a.string(),
    author: a.string(),
    category: a.string(),
    template: a.hasOne("Template", "pageId"),
    isPublished: a.boolean().default(false),
    publishedAt: a.datetime(),
})
    .secondaryIndexes(index => [
        index('slug').queryField('listPageBySlug')
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['create', 'update', 'delete', 'read']),
        allow.ownerDefinedIn('adminEmail').identityClaim('email').to(['read', 'update']),
    ]);