import { createTargetServer } from './targetServer.js';

const port = Number(process.env.PORT ?? 8080);
createTargetServer().listen(port, () => console.log(`target server listening on port ${port}`));
