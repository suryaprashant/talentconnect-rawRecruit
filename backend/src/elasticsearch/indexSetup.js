import { esClient } from './client.js';

export async function createResumeIndex() {
  const indexName = 'resumes';

  const exists = await esClient.indices.exists({ index: indexName });
  if (!exists) {
    await esClient.indices.create({
  index: indexName,
  body: {
    mappings: {
      properties: {
        id: { type: "integer" },                          // unique candidate ID
        name: { type: "text" },                           // searchable full-text
        location: { type: "keyword" },                    // exact match/filter
        currentSalary: { type: "integer" },               // numeric filter/sort
        expectedSalary: { type: "integer" },              // numeric filter/sort
        email: { type: "keyword" },                       // exact match
        phone: { type: "keyword" },                       // exact match
        linkedin: { type: "keyword", index: false },      // stored but not searchable
        github: { type: "keyword", index: false },        // stored but not searchable
        portfolio: { type: "keyword", index: false },     // optional link
        cv: { type: "keyword", index: false },            // CV file link
        education: { type: "text" },                      // searchable
        experience: { type: "integer" },                  // numeric filter/sort
        languages: { type: "keyword" },                   // array of exact values
        gender: { type: "keyword" },                      // filterable
        age: { type: "integer" },                         // numeric filter/sort
        designation: { type: "text" },                    // searchable
        industry: { type: "keyword" },                    // filterable
        skills: { type: "text" },                         // full-text search
        shortlisted: { type: "boolean" },                 // yes/no filter
        status: { type: "keyword" },                      // active/expired
        postedBy: { type: "keyword" },                    // user who posted
        appliedDate: { type: "date", format: "yyyy-MM-dd" } // proper date field
      }
    }
  }
});

    console.log(`Index ${indexName} created`);
  } else {
    console.log(`Index ${indexName} already exists`);
  }
}
