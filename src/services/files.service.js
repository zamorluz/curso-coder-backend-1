import path from "path";
import { fileURLToPath } from "url";

const pathFile = fileURLToPath(import.meta.url);
const pathServices = path.dirname(pathFile);
const __root = path.resolve(pathServices, "../../");
const __src = __root + "/src";
const __volumes = __root + "/volumes";
const __public = __src + "/public";

export {
    __root,
    __src,
    __volumes,
    __public,
}