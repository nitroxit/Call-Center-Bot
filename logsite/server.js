const express = require('express');
const app = express();
const port = 3000; // Change to your preferred port
const MongoClient = require('mongodb').MongoClient;

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = '<db_name_here>';

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = new MongoClient(url);
    await client.connect();
    
    const db = client.db(dbName);
    const documents = await db.collection('<collection_name_here>').find().toArray();

    // Render the Pug template with the retrieved documents
    res.render('index', { documents });

    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
