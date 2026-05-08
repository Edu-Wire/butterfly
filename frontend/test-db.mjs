import * as db from './lib/db.js';
console.log('Exports from lib/db.js:', Object.keys(db));
if (db.addToCart) {
    console.log('✅ addToCart found');
} else {
    console.log('❌ addToCart NOT found');
}
