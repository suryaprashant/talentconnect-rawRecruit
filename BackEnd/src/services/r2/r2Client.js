import { PutObjectCommand } from "@aws-sdk/client-s3";

import { r2Client } from "../../../config/cloudflareR2.config.js";
import cloudflareR2Config from "../../../config/cloudflareR2.config.js";

class R2Service {
    async uploadFile({
        key,
        body,
        contentType,
        metadata = {},
    }) {
        const command = new PutObjectCommand({
            Bucket: cloudflareR2Config.bucketName,

            Key: key,

            Body: body,

            ContentType: contentType,

            Metadata: metadata,
        });

        await r2Client.send(command);

        return {
            success: true,
            bucket: cloudflareR2Config.bucketName,
            key,
        };
    }
}

export default new R2Service();