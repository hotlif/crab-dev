
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: MarkifyThemeConfig = {
    layouts: join(__dirname, "layouts", "index.ts"),
    routers: join(__dirname, "routers", "index.ts")
}

export default config;
