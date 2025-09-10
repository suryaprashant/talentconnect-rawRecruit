import { esClient } from './client.js';

export async function createResumeIndex() {
  const indexName = 'search-z7dm';

  const exists = await esClient.indices.exists({ index: indexName });
  if (!exists) {
    await esClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            skills: { type: 'text' },
            location: { type: 'keyword' },
            experience: { type: 'integer' },
            salary: { type: 'integer' },
          },
        },
      },
    });
    console.log(`Index ${indexName} created`);
  } else {
    console.log(`Index ${indexName} already exists`);
  }
}
