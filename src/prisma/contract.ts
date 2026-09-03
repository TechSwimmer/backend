import { defineContract } from '@prisma/orm-mongo/contract-builder';

export const contract = defineContract(
  {},
  ({ field, model, rel }) => ({
    models: {
      User: model('User', {
        collection: 'users',
        fields: {
          _id: field.objectId(),
          email: field.string(),
          username: field.string().optional(),
          name: field.string().optional(),
        },
        relations: {
          posts: rel.hasMany('Post', { from: '_id', to: 'authorId' }),
        },
      }),

      Post: model('Post', {
        collection: 'posts',
        fields: {
          _id: field.objectId(),
          title: field.string(),
          content: field.string().optional(),
          authorId: field.objectId(),
        },
        relations: {
          author: rel.belongsTo('User', { from: 'authorId', to: '_id' }),
        },
      }),
    },
  }),
);
