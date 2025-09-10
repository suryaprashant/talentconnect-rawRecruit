import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE, // or your cloud endpoint
  auth: {
    apiKey: process.env.ELASTICSEARCH_AUTHKEY,
  },
  serverMode: 'serverless',
});


