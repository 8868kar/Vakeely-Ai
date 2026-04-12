import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import Case from '../models/Case.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vakeely';
const CSV_FILE_PATH = 'C:\\Users\\Kartik\\Desktop\\VAkeely\\archive\\judgments.csv';
const MAX_BATCH_SIZE = 500; 
const MAX_TOTAL_CASES = 5000;

async function runSeeder() {
  try {
    console.log('Connecting to MongoDB...', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    
    // Check if cases already exist
    const count = await Case.countDocuments();
    if (count > 0) {
      console.log(`There are already ${count} cases in DB. Skipping seed to prevent duplicates.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`ERROR: Could not find CSV file at ${CSV_FILE_PATH}`);
      console.error('Please make sure you have extracted the dataset there.');
      process.exit(1);
    }

    console.log(`Starting to parse and insert data from ${CSV_FILE_PATH}...`);
    let batch: any[] = [];
    let totalInserted = 0;
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', async (row) => {
          if (totalInserted >= MAX_TOTAL_CASES) return;

          const title = `${row['pet'] || 'Unknown Petitioner'} vs ${row['res'] || 'Unknown Respondent'}`;
          
          let parsedDate = new Date(); // Default
          if (row['judgment_dates']) {
            const parts = row['judgment_dates'].split('-');
            if (parts.length === 3) {
              const monthMap: Record<string, string> = { "Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12" };
              const year = parts[2];
              const month = monthMap[parts[1]] || "01";
              const day = parts[0];
              const d = new Date(`${year}-${month}-${day}`);
              if (!isNaN(d.getTime())) parsedDate = d;
            }
          }

          const caseInfo = {
            title: title.length > 200 ? title.substring(0, 200) + '...' : title,
            petitioner: row['pet'] || '',
            respondent: row['res'] || '',
            date: parsedDate,
            bench: row['bench'] || '',
            judgmentText: 'Judgment text is not present in metadata. Full text is available in the respective PDF document.'
          };

          batch.push(caseInfo);

          if (batch.length >= MAX_BATCH_SIZE) {
            totalInserted += batch.length;
            const currentBatch = [...batch];
            batch = []; 
            try {
              await Case.insertMany(currentBatch, { ordered: false });
              console.log(`Inserted batch of ${currentBatch.length} cases. Total: ${totalInserted}`);
            } catch (err: any) {
              console.error(`Error inserting batch:`, err.message);
            }
          }
        })
        .on('end', async () => {
          if (batch.length > 0 && totalInserted < MAX_TOTAL_CASES) {
            totalInserted += batch.length;
            try {
              await Case.insertMany(batch, { ordered: false });
              console.log(`Inserted final batch of ${batch.length} cases.`);
            } catch (err: any) {
              console.error(`Error inserting final batch:`, err.message);
            }
          }
          console.log(`\nSeed completed successfully. Total cases inserted: ${totalInserted}`);
          await mongoose.disconnect();
          resolve(true);
        })
        .on('error', (error) => {
          console.error('Error during CSV parsing:', error);
          reject(error);
        });
    });

  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
}

runSeeder();
