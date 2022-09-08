"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CustomError_1 = require("./CustomError");
class GQLService {
    error(code, text) {
        const errors = {
            404: 'Data not found.',
        };
        text = text ?? (errors[code] ?? 'Oops, something went wrong. please try again.');
        throw Error(text);
    }
    validationError(error) {
        const err = new CustomError_1.CustomError('Validation error.');
        err.extensions = { validationErrors: error?.messages?.errors ?? error };
        throw err;
    }
    async upload(file) {
        const path = require('path');
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const storedFileName = `${Date.now()}-${filename}`;
        const storedFileUrl = path.resolve(__dirname + '/../../public/uploads') + '/' + storedFileName;
        await new Promise((resolve, reject) => {
            const writeStream = (0, fs_1.createWriteStream)(storedFileUrl);
            writeStream.on("finish", resolve);
            writeStream.on("error", (error) => {
                (0, fs_1.unlink)(storedFileUrl, () => {
                    reject(error);
                });
            });
            stream.on("error", (error) => writeStream.destroy(error));
            stream.pipe(writeStream);
        });
        return storedFileName;
    }
}
exports.default = GQLService;
//# sourceMappingURL=GQLService.js.map