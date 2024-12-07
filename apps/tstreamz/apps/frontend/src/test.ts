import { connectMongo } from "@cmn/utils/bend/funcs";
import { config } from "dotenv";
import mongoose from "mongoose";

export async function migrateFieldType() {
    try {
        config({path: "/media/tonni/win/src/Mint/Documents/RF/Web/turbo-wp/tunedstreamz/apps/tstreamz/apps/frontend/.env"})
        await connectMongo(true, "tunedstreamz".toLowerCase())
        const MyModel = mongoose.model('User', new mongoose.Schema({
    watchlist: { type: mongoose.Schema.Types.Mixed }, // Temporarily allow mixed type
  }));
      const documents = await MyModel.find({}); // Fetch all documents
  
      for (const doc of documents) {
        // Convert field value from String to Number
        const newValue = doc.watchlist;
  
        // Update the document
        doc.watchlist = newValue;
        await doc.save();
      }
  
      console.log('Migration completed successfully!');
    } catch (error) {
      console.error('Migration error:', error);
    } finally {
        mongoose.connection.close();
    }
  }

migrateFieldType()