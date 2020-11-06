const mongoose = require('mongoose')

const registroSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    apellidos:{
        type: String,
        required:true
    },
    fechaRegistro:{
        type: Date,
        required:true
    },
    libros:{
        type: Array,
        "default":[]
    }
})

module.exports = mongoose.model('registro',registroSchema)