import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

const checkDatabaseStructure = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.URI || 'mongodb://localhost:27017/nava_tara');
    console.log('Connected to database');
    
    // Get database information
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`\nTotal collections in database: ${collections.length}`);
    
    // Get stats for each collection
    console.log('\nCollection statistics:');
    console.log('-------------------------');
    
    const collectionStats = [];
    
    for (const collection of collections) {
      const collName = collection.name;
      const stats = await db.command({ collStats: collName });
      const count = await db.collection(collName).countDocuments();
      
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      const storageSizeInMB = (stats.storageSize / (1024 * 1024)).toFixed(2);
      
      collectionStats.push({
        name: collName,
        count,
        sizeInMB,
        storageSizeInMB
      });
      
      console.log(`Collection: ${collName}`);
      console.log(`- Documents: ${count}`);
      console.log(`- Size: ${sizeInMB} MB`);
      console.log(`- Storage Size: ${storageSizeInMB} MB`);
      console.log('-------------------------');
    }
    
    // Sort collections by size
    collectionStats.sort((a, b) => parseFloat(b.sizeInMB) - parseFloat(a.sizeInMB));
    
    console.log('\nCollections by size (largest first):');
    collectionStats.forEach((stat, idx) => {
      console.log(`${idx + 1}. ${stat.name} - ${stat.sizeInMB} MB (${stat.count} documents)`);
    });
    
    // Check specifically for student history collection
    const studentHistoryCollection = collectionStats.find(stat => 
      stat.name.toLowerCase().includes('studenthistory') || 
      stat.name.toLowerCase().includes('student_history')
    );
    
    if (studentHistoryCollection) {
      console.log('\nStudent History Collection:');
      console.log(`Name: ${studentHistoryCollection.name}`);
      console.log(`Documents: ${studentHistoryCollection.count}`);
      console.log(`Size: ${studentHistoryCollection.sizeInMB} MB`);
      
      // Sample a few documents to understand structure
      const sampleDocs = await db.collection(studentHistoryCollection.name)
        .find({})
        .limit(2)
        .toArray();
      
      console.log('\nSample documents:');
      console.log(JSON.stringify(sampleDocs, null, 2));
    } else {
      console.log('\nNo specific student history collection found');
    }
    
    return {
      collectionCount: collections.length,
      collections: collectionStats
    };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
};

// Run the function
checkDatabaseStructure(); 