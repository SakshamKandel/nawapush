import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';

configDotenv();

const checkNotices = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.URI || 'mongodb://localhost:27017/nava_tara');
    console.log('Connected to database');
    
    // Get all notices
    const notices = await mongoose.connection.collection('notices').find({}).toArray();
    console.log(`Total notices: ${notices.length}`);
    
    // Get attachments
    const attachmentsInDB = notices
      .map(notice => notice.attachments)
      .filter(Boolean);
    
    console.log(`Notices with attachments: ${attachmentsInDB.length}`);
    console.log('Attachment filenames in DB:', attachmentsInDB);
    
    // Get files from directory
    const noticeFilesDir = path.join(process.cwd(), 'public', 'notice_files');
    const filesInDirectory = fs.readdirSync(noticeFilesDir);
    
    console.log(`\nFiles in directory: ${filesInDirectory.length}`);
    console.log('Files in directory:', filesInDirectory);
    
    // Find unused files
    const unusedFiles = filesInDirectory.filter(file => !attachmentsInDB.includes(file));
    console.log(`\nUnused files: ${unusedFiles.length}`);
    console.log('Unused files:', unusedFiles);
    
    // Calculate size of unused files
    let totalSize = 0;
    for (const file of unusedFiles) {
      const stats = fs.statSync(path.join(noticeFilesDir, file));
      totalSize += stats.size;
    }
    
    console.log(`Total size of unused files: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    
    return { 
      attachmentsInDB, 
      filesInDirectory, 
      unusedFiles,
      totalSize: (totalSize / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the function
checkNotices(); 