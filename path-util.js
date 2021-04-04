import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const currentFile = (importMetaUrl = import.meta.url) => {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = dirname(__filename);
    return { __filename, __dirname };
}