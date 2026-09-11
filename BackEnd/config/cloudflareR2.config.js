import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

export const cloudflareR2Config = {
    accountId: process.env.R2_ACCOUNT_ID ,
    endpoint: process.env.R2_ENDPOINT,
    bucketName: process.env.R2_BUCKET_NAME,
    region: process.env.R2_REGION || "auto",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
};

export const r2Client = new S3Client({
    region: cloudflareR2Config.region,

    endpoint: cloudflareR2Config.endpoint,

    credentials: {
        accessKeyId: cloudflareR2Config.accessKeyId,
        secretAccessKey:
            cloudflareR2Config.secretAccessKey,
    },
});

export default cloudflareR2Config;