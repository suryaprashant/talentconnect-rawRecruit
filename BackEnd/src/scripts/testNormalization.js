import mongoose from "mongoose";
import dotenv from "dotenv";

import { resolveCollege, resolveCompany }
  from "../services/normalizationService.js";

dotenv.config();

await mongoose.connect(process.env.DB_URL);

console.log(
  await resolveCollege("IITD")
);

console.log(
  await resolveCollege(
    "Indian Institute of Technology Delhi"
  )
);

console.log(
  await resolveCompany(
    "Microsoft India"
  )
);

console.log(
  await resolveCompany("MSFT")
);

console.log(
  await resolveCompany("Zomato")
);

console.log(
  await resolveCompany("RawRecruit")
);

process.exit(0);