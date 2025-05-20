import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

configDotenv();

// Function to get user confirmation
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
};

// Check which collections are actually referenced in code
const getReferencedCollections = async () => {
  try {
    const referencedCollections = {
      'admins': 'Used for admin authentication and management',
      'teachers': 'Stores teacher data',
      'students': 'Stores student data',
      'studentfees': 'Tracks student fee payments',
      'routines': 'Stores class routines/schedules',
      'notices': 'Stores school notices',
      'teachersalaries': 'Records teacher salary information',
      'classstructurefees': 'Defines fee structure by class',
      'academicyears': 'Tracks academic year information',
      'notifications': 'System notifications',
      'teachernotices': 'Notices for teachers',
      'auditlogs': 'System audit logs',
      'leaverequests': 'Teacher leave requests (uses "LeaveRequest" model)'
    };

    return referencedCollections;
  } catch (error) {
    console.error('Error getting referenced collections:', error);
    return {};
  }
};

const enhancedDatabaseCleanup = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.URI || 'mongodb://localhost:27017/nava_tara');
    console.log('Connected to database');
    
    // Get database information
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`\nTotal collections in database: ${collections.length}\n`);
    
    // Get collection information
    const collectionStats = [];
    const emptyCollections = [];
    
    console.log('Scanning all collections for data...');
    
    for (const collection of collections) {
      const collName = collection.name;
      const stats = await db.command({ collStats: collName });
      const count = await db.collection(collName).countDocuments();
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(4);
      
      collectionStats.push({
        name: collName,
        count,
        sizeInMB
      });
      
      // Track empty collections
      if (count === 0) {
        emptyCollections.push(collName);
      }
      
      console.log(`Collection: ${collName.padEnd(30)} ${count.toString().padStart(5)} documents ${sizeInMB.padStart(10)} MB`);
    }
    
    // Known unused collections (based on code analysis)
    const knownUnusedCollections = [
      {
        name: 'studenthistories',
        reason: 'Historical data that may not be needed anymore'
      },
      {
        name: 'classfees',
        reason: 'Empty collection, while classstructurefees is used for fee structure'
      },
      {
        name: 'leaverequests',
        reason: 'Empty collection - Leave requests use "LeaveRequest" model instead'
      },
      {
        name: 'teacherspayroll',
        reason: 'Potentially redundant with teacherpayrolls'
      }
    ];
    
    // Get collections referenced in code
    const referencedCollections = await getReferencedCollections();
    
    // Find potentially unused collections (not in referenced list)
    const unreferencedCollections = collectionStats
      .filter(stat => !referencedCollections[stat.name])
      .map(stat => ({
        name: stat.name,
        reason: 'Not directly referenced in code',
        count: stat.count,
        sizeInMB: stat.sizeInMB
      }));
    
    // Combine known unused with unreferenced
    const allCandidatesForRemoval = [
      ...knownUnusedCollections.map(col => {
        const stats = collectionStats.find(s => s.name === col.name);
        return {
          ...col,
          count: stats ? stats.count : 0,
          sizeInMB: stats ? stats.sizeInMB : '0.0000'
        };
      }),
      ...unreferencedCollections.filter(col => 
        !knownUnusedCollections.some(known => known.name === col.name)
      )
    ];
    
    // Output summary
    console.log('\n=== DATABASE CLEANUP RECOMMENDATIONS ===');
    
    // Unused collections
    console.log('\n1. Known unused collections:');
    knownUnusedCollections.forEach((col, index) => {
      const stats = collectionStats.find(s => s.name === col.name);
      if (stats) {
        console.log(`   - ${col.name.padEnd(30)} ${stats.count.toString().padStart(5)} documents ${stats.sizeInMB.padStart(10)} MB`);
        console.log(`     Reason: ${col.reason}`);
      } else {
        console.log(`   - ${col.name.padEnd(30)} (Not found in database)`);
        console.log(`     Reason: ${col.reason}`);
      }
    });
    
    // Empty collections
    console.log('\n2. Empty collections (0 documents):');
    if (emptyCollections.length > 0) {
      emptyCollections.forEach(col => {
        const referenced = referencedCollections[col] ? 'Yes' : 'No';
        console.log(`   - ${col.padEnd(30)} Referenced in code: ${referenced}`);
      });
    } else {
      console.log('   No empty collections found');
    }
    
    // Unreferenced collections
    console.log('\n3. Collections not directly referenced in code:');
    const unusedUnreferencedCollections = unreferencedCollections.filter(col => 
      !knownUnusedCollections.some(known => known.name === col.name)
    );
    
    if (unusedUnreferencedCollections.length > 0) {
      unusedUnreferencedCollections.forEach(col => {
        console.log(`   - ${col.name.padEnd(30)} ${col.count.toString().padStart(5)} documents ${col.sizeInMB.padStart(10)} MB`);
      });
    } else {
      console.log('   No additional unreferenced collections found');
    }
    
    // Get user confirmation for collections to remove
    console.log('\n=== CLEANUP ACTIONS ===');
    
    // Process removal candidates
    const removedCollections = [];
    
    // Ask about known unused collections first
    for (const collection of allCandidatesForRemoval) {
      const stats = collectionStats.find(s => s.name === collection.name);
      if (!stats) {
        console.log(`\nSkipping ${collection.name} as it was not found in the database`);
        continue;
      }
      
      const isReferenced = !!referencedCollections[collection.name];
      const isEmpty = stats.count === 0;
      
      console.log(`\nCollection: ${collection.name}`);
      console.log(`- Documents: ${stats.count}`);
      console.log(`- Size: ${stats.sizeInMB} MB`);
      console.log(`- Referenced in code: ${isReferenced ? 'Yes' : 'No'}`);
      console.log(`- Empty: ${isEmpty ? 'Yes' : 'No'}`);
      console.log(`- Reason for consideration: ${collection.reason}`);
      
      // Warning for referenced collections
      if (isReferenced && !isEmpty) {
        console.log('\n⚠️ WARNING: This collection is referenced in code and contains data!');
        console.log('  Removing it may cause application errors.');
      }
      
      const answer = await askQuestion(`Do you want to remove the ${collection.name} collection? (yes/no): `);
      
      if (answer.toLowerCase() === 'yes') {
        try {
          await db.dropCollection(collection.name);
          console.log(`✓ Successfully removed ${collection.name} collection`);
          removedCollections.push({
            name: collection.name,
            count: stats.count,
            sizeInMB: stats.sizeInMB,
            reason: collection.reason
          });
        } catch (error) {
          console.error(`Error removing ${collection.name} collection:`, error.message);
        }
      } else {
        console.log(`Skipping removal of ${collection.name} collection`);
      }
    }
    
    // Ask about any remaining empty collections that weren't in the unused list
    const remainingEmptyCollections = emptyCollections.filter(col => 
      !allCandidatesForRemoval.some(cand => cand.name === col)
    );
    
    if (remainingEmptyCollections.length > 0) {
      console.log('\n=== EMPTY COLLECTIONS ===');
      
      for (const collName of remainingEmptyCollections) {
        const isReferenced = !!referencedCollections[collName];
        
        console.log(`\nEmpty collection: ${collName}`);
        console.log(`- Referenced in code: ${isReferenced ? 'Yes' : 'No'}`);
        
        if (isReferenced) {
          console.log('⚠️ WARNING: This collection is referenced in code even though it\'s empty.');
          console.log('  Removing it may cause application errors when new data is expected to be added.');
        }
        
        const answer = await askQuestion(`Do you want to remove the empty ${collName} collection? (yes/no): `);
        
        if (answer.toLowerCase() === 'yes') {
          try {
            await db.dropCollection(collName);
            console.log(`✓ Successfully removed empty ${collName} collection`);
            removedCollections.push({
              name: collName,
              count: 0,
              sizeInMB: '0.0000',
              reason: 'Empty collection'
            });
          } catch (error) {
            console.error(`Error removing ${collName} collection:`, error.message);
          }
        } else {
          console.log(`Skipping removal of ${collName} collection`);
        }
      }
    }
    
    // Save cleanup log
    if (removedCollections.length > 0) {
      const logFilePath = path.join(process.cwd(), 'database-cleanup-log.txt');
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      
      const logContent = `\n--- Database Cleanup ${timestamp} ---\n` +
        removedCollections.map(c => 
          `${c.name}: ${c.count} documents, ${c.sizeInMB} MB - ${c.reason}`
        ).join('\n') +
        '\n------------------------\n';
      
      fs.appendFileSync(logFilePath, logContent);
      console.log(`\nCleanup log saved to ${logFilePath}`);
      
      // Summary
      const totalSizeMB = removedCollections.reduce((acc, col) => acc + parseFloat(col.sizeInMB), 0).toFixed(4);
      console.log(`\n=== CLEANUP SUMMARY ===`);
      console.log(`Removed ${removedCollections.length} collections`);
      console.log(`Freed up approximately ${totalSizeMB} MB of space`);
    } else {
      console.log('\nNo collections were removed');
    }
    
    return {
      success: true,
      message: 'Database cleanup completed',
      removedCollections
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: error.message
    };
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
};

// Run the function
enhancedDatabaseCleanup(); 