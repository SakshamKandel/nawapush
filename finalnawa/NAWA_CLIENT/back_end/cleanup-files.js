import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';

configDotenv();

const cleanupFiles = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.URI || 'mongodb://localhost:27017/nava_tara');
    console.log('Connected to database');
    
    // Get all notices
    const notices = await mongoose.connection.collection('notices').find({}).toArray();
    console.log(`Total notices: ${notices.length}`);
    
    // Get attachments that are in use
    const attachmentsInDB = notices
      .map(notice => notice.attachments)
      .filter(Boolean);
    
    console.log(`Notices with attachments: ${attachmentsInDB.length}`);
    
    // Get files from directory
    const noticeFilesDir = path.join(process.cwd(), 'public', 'notice_files');
    const filesInDirectory = fs.readdirSync(noticeFilesDir);
    
    console.log(`\nFiles in directory: ${filesInDirectory.length}`);
    
    // Find unused files
    const unusedFiles = filesInDirectory.filter(file => !attachmentsInDB.includes(file));
    console.log(`\nUnused files to delete: ${unusedFiles.length}`);
    
    // Calculate size before deletion
    let totalSize = 0;
    for (const file of unusedFiles) {
      const filePath = path.join(noticeFilesDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    }
    
    console.log(`Total size to be freed: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    
    // Delete unused files
    let deletedCount = 0;
    for (const file of unusedFiles) {
      const filePath = path.join(noticeFilesDir, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`Error deleting ${file}:`, err);
      }
    }
    
    console.log(`\nSuccessfully deleted ${deletedCount} unused files`);
    console.log(`Freed up approximately ${(totalSize / (1024 * 1024)).toFixed(2)} MB of space`);
    
    return { 
      deletedCount,
      freedSpace: (totalSize / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the function
cleanupFiles(); 