
import fs from 'fs';
import 'dotenv/config';
fs.writeFileSync('env_check.txt', 'KEY: ' + (process.env.FASHN_API_KEY || 'MISSING'));
                                                                                