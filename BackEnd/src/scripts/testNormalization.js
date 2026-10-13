import mongoose from "mongoose";
import dotenv from "dotenv";

import { resolveCollege, resolveCompany }
  from "../services/normalizationService.js";
import {
  refreshFuseIndex,
  getCompanyFuse,
  getCollegeFuse,
} from "../services/fuseIndexService.js";

dotenv.config();

await mongoose.connect(process.env.DB_URL);
await refreshFuseIndex();
console.log(
  "Company Fuse:",
  !!getCompanyFuse()
);

console.log(
  "College Fuse:",
  !!getCollegeFuse()
);

// console.log(
//   await resolveCompany(
//     "Microsoft"
//   )
// );

// console.log(
//   await resolveCompany(
//     "Micorsoft"
//   )
// );

// console.log(
//   await resolveCompany(
//     "Microsft"
//   )
// );

console.log(
  await resolveCollege(
    "IIT-D"
  )
);

// console.log(
//   await resolveCollege(
//     "Indian Institute Technology Delhi"
//   )
// );
// console.log(
//   await resolveCompany(
//     "Raw Recruit"
//   )
// );
process.exit(0);