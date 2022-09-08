import { createWriteStream, unlink } from "fs";
import { CustomError } from "./CustomError";

export default class GQLService {
    public error(code: any, text?: any) {
        const errors = {
            404: 'Data not found.',
        };

        text = text ?? (errors[code] ?? 'Oops, something went wrong. please try again.');

        throw Error(text);
    }

    public validationError(error: any) {
        const err = new CustomError('Validation error.');

        err.extensions = {validationErrors: error?.messages?.errors ?? error};

        throw err;
    }

    // https://github.com/jaydenseric/apollo-upload-examples/blob/master/api/storeUpload.mjs
    public async upload(file: any) {
        const path = require('path');

        const { createReadStream, filename } = await file;

        const stream = createReadStream();

        const storedFileName = `${Date.now()}-${filename}`;

        const storedFileUrl = path.resolve(__dirname + '/../../public/uploads') + '/' + storedFileName;

        // Store the file in the filesystem.
        await new Promise((resolve, reject) => {
          // Create a stream to which the upload will be written.
          const writeStream = createWriteStream(storedFileUrl);

          // When the upload is fully written, resolve the promise.
          writeStream.on("finish", resolve);

          // If there's an error writing the file, remove the partially written file
          // and reject the promise.
          writeStream.on("error", (error) => {
            unlink(storedFileUrl, () => {
              reject(error);
            });
          });

          // In Node.js <= v13, errors are not automatically propagated between piped
          // streams. If there is an error receiving the upload, destroy the write
          // stream with the corresponding error.
          stream.on("error", (error) => writeStream.destroy(error));

          // Pipe the upload into the write stream.
          stream.pipe(writeStream);
        });

        return storedFileName;
    }
}
