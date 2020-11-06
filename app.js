const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://mongo:27017/registroDB'

const app = express()

mongoose.connect(url,{useNewUrlParser:true})

const con = mongoose.connection

con.on('open',function(){
    console.log("Connected...")
})

app.use(express.json())

const registroRouter = require('./controller/registros')
app.use('/registros',registroRouter)

app.listen(9000, function(){
    console.log("Server started")
})