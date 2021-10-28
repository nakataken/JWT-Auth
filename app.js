import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import route from './routes/route.js';

let mongo_uri = process.env.MONGO_URI;

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/", express.static('./public/'));

mongoose.connect(mongo_uri, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started on port 3000");
            console.log("Connected to database");
        })
    })
    .catch((err) => {
        console.log(err);
    })

app.use(route);