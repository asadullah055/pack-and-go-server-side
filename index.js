const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()

require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssiqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("travelBD");
        const travelCollection = database.collection('travelItem')
        const orderCollection = database.collection('order')


        app.get('/travelItem', async (req, res) => {
            const cursor = travelCollection.find({})
            const travels = await cursor.toArray()
            res.send(travels)
        })

        app.post('/travelItem', async (req, res) => {
            const travels = req.body
            const result = await travelCollection.insertOne(travels);
            res.json(result)
        })

        //order

        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({})
            const order = await cursor.toArray()
            res.send(order)
        })


        // get single service
        app.get('/travelItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const travels = await travelCollection.findOne(query)
            res.json(travels)
        })


        app.post('/order', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        app.get('/order/:orderId', async (req, res) => {
            const id = req.params.orderId;
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(query)
            res.json(order)
        })



        // update
        app.put('/order/:orderId', async (req, res) => {
            const id = req.params.orderId
            const updateAction = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    action: updateAction.action
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        // delete order
        app.delete('/order/:orderId', async (req, res) => {
            const id = req.params.orderId
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running Travel Server')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})