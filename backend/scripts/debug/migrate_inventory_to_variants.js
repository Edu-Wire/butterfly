/**
 * Migration Script: Old Inventory Structure to New Variant-based Structure
 * 
 * OLD: Each variant was a separate document
 * NEW: One document per product with variants array
 * 
 * ⚠️ IMPORTANT: Backup your database before running this!
 * 
 * Run: node migrate_inventory_to_variants.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Old schema (for reading existing data)
const oldInventorySchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    color: String,
    size: String,
    sku: String,
    totalStock: Number,
    reservedStock: Number,
    soldCount: Number,
    lowStockThreshold: Number,
    costPrice: Number,
    status: String,
    warehouseLocation: String,
    aisle: String,
    shelf: String,
    supplier: String,
    batchNumber: String,
    lastRestocked: Date
}, { collection: 'inventories' });

const OldInventory = mongoose.model('OldInventoryTemp', oldInventorySchema);

// New schema (variant-based)
const variantSchema = new mongoose.Schema({
    size: { type: String, required: true, default: "N/A" },
    color: { type: String, required: true, default: "N/A" },
    sku: { type: String, required: true },
    totalStock: { type: Number, required: true, min: 0, default: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    soldCount: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    costPrice: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ["in_stock", "out_of_stock", "discontinued"], default: "in_stock" }
}, { _id: true });

const newInventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    variants: [variantSchema],
    warehouseLocation: String,
    aisle: String,
    shelf: String,
    supplier: String,
    batchNumber: String,
    lastRestocked: Date
}, {
    collection: 'inventories_new',
    timestamps: true
});

const NewInventory = mongoose.model('NewInventoryTemp', newInventorySchema);

async function migrate() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!');

        // Fetch all old inventory records
        console.log('\n📦 Fetching old inventory records...');
        const oldRecords = await OldInventory.find({});
        console.log(`Found ${oldRecords.length} old inventory records`);

        if (oldRecords.length === 0) {
            console.log('⚠️  No old records found. Exiting.');
            process.exit(0);
        }

        // Group by productId
        console.log('\n🔄 Grouping variants by product...');
        const grouped = {};

        oldRecords.forEach(record => {
            const pid = record.productId.toString();
            if (!grouped[pid]) {
                grouped[pid] = {
                    productId: record.productId,
                    variants: [],
                    warehouseLocation: record.warehouseLocation,
                    aisle: record.aisle,
                    shelf: record.shelf,
                    supplier: record.supplier,
                    batchNumber: record.batchNumber,
                    lastRestocked: record.lastRestocked
                };
            }

            grouped[pid].variants.push({
                size: record.size || 'N/A',
                color: record.color || 'N/A',
                sku: record.sku,
                totalStock: record.totalStock || 0,
                reservedStock: record.reservedStock || 0,
                soldCount: record.soldCount || 0,
                lowStockThreshold: record.lowStockThreshold || 5,
                costPrice: record.costPrice || 0,
                status: record.status || 'in_stock'
            });
        });

        const productCount = Object.keys(grouped).length;
        console.log(`Grouped into ${productCount} products`);

        // Create new inventory documents
        console.log('\n💾 Creating new inventory documents...');
        let created = 0;

        for (const [productId, data] of Object.entries(grouped)) {
            try {
                await NewInventory.create(data);
                created++;
                console.log(`✅ Created inventory for product ${productId} with ${data.variants.length} variants`);
            } catch (err) {
                console.error(`❌ Error creating inventory for product ${productId}:`, err.message);
            }
        }

        console.log(`\n✅ Migration complete! Created ${created}/${productCount} inventory documents`);
        console.log('\n⚠️  Next steps:');
        console.log('1. Verify the new data in "inventories_new" collection');
        console.log('2. If everything looks good:');
        console.log('   - Rename "inventories" to "inventories_backup"');
        console.log('   - Rename "inventories_new" to "inventories"');
        console.log('3. Test your application thoroughly');
        console.log('4. After confirming everything works, you can delete "inventories_backup"');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

migrate();
