const express = require('express')
const router = express.Router()
const Registro = require('../model/registro')
const Request = require("request");
const registro = require('../model/registro');

router.get('/',async function(req,res){
    try{
        const registros = await Registro.find()
        res.json(registros)

    }
    catch(err){
        res.send('Error ' + err)
    }
})

router.get('/:id',async function(req,res){
    try{
        const registro = await Registro.findById(req.params.id)
        res.json(registro)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

router.post('/',async function(req,res){ 
    try{
        const reg = new Registro({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        fechaRegistro:req.body.fechaRegistro,
        libros:req.body.libros
    })
        const r1 = await reg.save()
        res.json(r1)
    }  
    catch(err){
        res.send('Error ' + err)
    }
})

router.put('/:id',async function(req,res){ 
    try{
        const reg = await Registro.findById(req.params.id)   
        reg.nombre= req.body.nombre,
        reg.apellidos= req.body.apellidos,
        reg.fechaRegistro= req.body.fechaRegistro,
        reg.libros=req.body.libros
        await reg.save()
        res.send(reg)
     }
    catch(err){
        res.send('Error '+ err)
    }
})

router.delete('/:id',async function(req,res){
    try{
        await Registro.findByIdAndRemove(req.params.id)
        res.json("Deleted")
    }
    catch(err){
        res.send('Error '+ err)
    }
})

router.get('/personas/ordenadas', async function(req,res){
    try{
        const nombres = await Registro.find({},{nombre:1,_id:0})
        res.json(nombres.sort())
    }
    catch(err){
        res.send('Error '+ err)
    }
})

router.get('/libros/masPrestados', async function(req,res){
    try{
        const listLibros = await Registro.find({},{libros:1,_id:0})
        var libroCantidad = {}
        
        for(var i = 0; i < listLibros.length; i++){
            listLibros[i]["libros"].forEach(element => {
                libroCantidad[element] =(libroCantidad[element] == null)? 1:libroCantidad[element]+1; 
            });
        }          

        var items = Object.keys(libroCantidad).map(function(key) {
            return [key, libroCantidad[key]];
            });

        items.sort(function(first, second) {
            return second[1] - first[1];
            });

        res.json(items.slice(0,3).map((libroCant)=>{
            return libroCant[0]
        }))
    }
    catch(err){
        res.send('Error '+ err)
    }
})

router.get('/detallados/:nombre', async function(req,res){
    try{
        let registro = await Registro.findOne({nombre:req.params.nombre})
        Request.get("http://192.168.99.100:8080/libros", (error, response, body) => {
            if(error) {
                throw error;
            }           
            let libros_Detalle = JSON.parse(body)
            console.log(libros_Detalle)
            detallesAñadir = []
            registro["libros"].forEach(libNombre=> {
                detallesAñadir.push(libros_Detalle.find(lib_Detalle=> lib_Detalle["nombre"] == libNombre))
                console.log(libNombre)
                })     
            registro = registro.toObject()
            registro["libros detalles"] = detallesAñadir
            res.send(registro)  
        })
    }
    catch(err){
        res.send('Error '+ err)
    }
})

module.exports = router