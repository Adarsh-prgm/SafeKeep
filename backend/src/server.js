import { app } from './app.js'; import { config } from './config.js';
app.listen(config.PORT,()=>console.log(`SafeKeep API listening on ${config.PORT}`));
