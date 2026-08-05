import { type SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [
  {
    name: 'post',
    type: 'document',
    title: 'Blog Post',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
        validation: (rule) => rule.required(),
      },
      {
        name: 'slug',
        type: 'slug',
        title: 'Slug',
        options: { source: 'title', maxLength: 96 },
        validation: (rule) => rule.required(),
      },
      {
        name: 'excerpt',
        type: 'text',
        title: 'Excerpt',
        rows: 3,
        validation: (rule) => rule.required(),
      },
      {
        name: 'content',
        type: 'array',
        title: 'Content',
        of: [
          { type: 'block' },
          {
            type: 'image',
            options: { hotspot: true },
            fields: [
              { name: 'alt', type: 'string', title: 'Alt text' },
            ],
          },
        ],
      },
      {
        name: 'category',
        type: 'string',
        title: 'Category',
        options: {
          list: [
            { title: 'Technology', value: 'Technology' },
            { title: 'Industry', value: 'Industry' },
            { title: 'Company', value: 'Company' },
          ],
        },
        validation: (rule) => rule.required(),
      },
      {
        name: 'readTime',
        type: 'string',
        title: 'Read Time',
        description: 'e.g. "5 min read"',
        validation: (rule) => rule.required(),
      },
      {
        name: 'publishedAt',
        type: 'datetime',
        title: 'Published at',
        validation: (rule) => rule.required(),
      },
      {
        name: 'author',
        type: 'object',
        title: 'Author',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'role', type: 'string', title: 'Role' },
        ],
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'category',
      },
    },
  },
];
