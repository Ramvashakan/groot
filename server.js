const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const parser = require('papaparse');
const port = 3000;
const path = require('path')
const app = express();

//set file size limit and parsing type
app.use(express.json({ limit: '50mb' }))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/groot', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then((res) => {
    console.log("Database connected")
})

var connection = mongoose.connection;
mongoose.Promise = global.Promise;


//upload the csv table in database
app.post('/upload', (req, res,) => {

    var filename = req.body.fileName.replace('.csv', '')
    var result = parser.parse(req.body.data, { header: true })
    var data = result.data[0]
    var keys = Object.keys(data)

    //encrypt when password is in the data
    if (keys.includes('password')) {

        result.data.forEach((user) => {
            const password = bcrypt.hash(user.password, 12);
            user.password = password;
            connection.collection(filename).insertOne(user);
        })
        return res.send(result.data.length + " data was successfully uploaded")

    }
    //Works when there is no password column
    else {

        try {
            connection.collection(filename).insertMany(result.data);
            var length = result.data.length
            return res.json({ response: length + " data was successfully uploaded" })
        }
        catch (err) {
            return res.send(err)
        }
    }
})

//Initial Call


//listen PORT
app.listen(port, () => {
    console.log('server connected');
})