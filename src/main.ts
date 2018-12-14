import sync from './syncApi';
import * as fs from 'fs';

const config = fs.readFileSync('./config.json', 'utf-8');

sync(JSON.parse(config));
