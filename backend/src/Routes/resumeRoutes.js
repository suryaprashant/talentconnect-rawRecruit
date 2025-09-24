import express from 'express';
import { esClient } from '../elasticsearch/client.js';
const router = express.Router();

// Upload / insert a candidate resume
router.post('.../company/dashboard/resume', async (req, res) => {
  try {
    const { name, skills, location, experience, salary } = req.body;
    await esClient.index({
      index: 'resumes',
      body: { name, skills, location, experience, salary },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Elasticsearch insert failed' });
  }
});

// Search resumes
router.post('.../company/dashboard/resume', async (req, res) => {
  const { query, location, experience, salary } = req.body;

  try {
    const result = await esClient.search({
      index: 'resumes',
      body: {
        query: {
          bool: {
            must: [
              query ? { multi_match: { query, fields: ['name', 'skills','designation'] } } : { match_all: {} },
            ],
            filter: [
              location ? { term: { location } } : null,
              experience ? { range: { experience: { gte: experience } } } : null,
              salary ? { range: { salary: { lte: salary } } } : null,
            ].filter(Boolean),
          },
        },
      },
    });

    res.json(result.hits.hits.map(hit => hit._source));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Search failed' });
  }
});
router.get('/',async(req,res)=>{
  console.log("hi");
})

export default router;
