import JobMeta from '../models/jobMeta.js';

export const seedDB = async () => {
  try {
    const defaultData = [
      {
        degree: "Bachelor of Technology (B.Tech)",
        streams: ["Computer Science", "Information Technology", "Electronics", "Mechanical"],
        skills: ["Java", "Python", "React", "Node.js", "Data Structures"]
      },
      {
        degree: "Master of Business Administration (MBA)",
        streams: ["Marketing", "Finance", "Human Resources", "Operations"],
        skills: ["Leadership", "Market Research", "Financial Modeling", "Excel"]
      },
      {
        degree: "Bachelor of Computer Applications (BCA)",
        streams: ["Software Development", "Data Science", "Web Technologies"],
        skills: ["HTML/CSS", "JavaScript", "SQL", "C++"]
      }
    ];

    for (const item of defaultData) {
      // $setOnInsert ensures we create the degree if it's missing
      // $addToSet ensures we add the default streams/skills without creating duplicates
      await JobMeta.findOneAndUpdate(
        { degree: item.degree },
        { 
          $setOnInsert: { degree: item.degree },
          $addToSet: { 
            streams: { $each: item.streams }, 
            skills: { $each: item.skills } 
          } 
        },
        { upsert: true, new: true }
      );
    }
    console.log("✅ Smart Sync: Default degrees and relationships verified.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
};