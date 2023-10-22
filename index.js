const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tsr7owr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // for brands
        const brandCollection = client.db('brandDB').collection('brand');

        // get all brands
        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post('/brands', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await brandCollection.insertOne(newBrand);
            res.send(result);
        })

        // get a specific brand
        app.get('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandCollection.findOne(query);
            res.send(result);
        })

        // For Products
        const productCollection = client.db('brandDB').collection('products');

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })


        // get all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get a specific product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };

            const product = {
                $set: {
                    productName: updatedProduct.productName,
                    productImage: updatedProduct.productImage,
                    brandName: updatedProduct.brandName,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    description: updatedProduct.description,
                    rating: updatedProduct.rating
                }
            }

            const result = await productCollection.updateOne(filter, product, options);
            res.send(result);
        })

        // Cart
        const cartCollection = client.db('brandDB').collection('cart');
        
        app.post('/cart', async (req, res) => {
            const addedProduct = req.body;
            console.log(addedProduct);
            const result = await cartCollection.insertOne(addedProduct);
            res.send(result);
        })

        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await cartCollection.findOne(query);
            res.send(result);
        })


        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: id }
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        



        
        
        
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Couture Chic is running');
})

app.listen(port, () => {
    console.log(`Couture Chic is running on port: ${port}`)
})