const express=require('express');
const sqlite=require('sqlite');
const bodyParser=require('body-parser');

const dbConnection=sqlite.open('banco.sqlite',{Promise})

const app=express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',async(req,res)=>{
    //res.send('JobiFy on line!');
  const db= await  dbConnection;
    const categoriasDB= await db.all('select * from categorias;');
    const vagas= await db.all('select * from vagas;');

    const categorias=categoriasDB.map(cat=>{
        return {...cat,
        vagas:vagas.filter(vaga=>vaga.categoria===cat.id)}
    })
    res.render('home',{categorias});
})

app.get('/vaga/:id',async(req,res)=>{
    //res.send('JobiFy on line!');

    const db= await   dbConnection
    const vaga= await db.get('select *from vagas where id='+req.params.id);
   
    res.render('vaga',{vaga});
})


app.get('/admin/',(req,res)=>{

    res.render('admin/home');
})

app.get('/admin/vagas',async(req,res)=>{

    const db= await dbConnection;
   const vagas= await db.all('select * from vagas;');

   res.render('admin/vagas', {vagas})
})

app.get('/admin/vagas/delete/:id',async(req,res)=>{

    const db=await dbConnection;

    await db.run('delete from vagas where id='+req.params.id);
    res.redirect('/admin/vagas');
})

app.get('/admin/vagas/nova',async(req,res)=>{
        
    const db=await dbConnection;
    const categorias= await db.all('select * from categorias');

    res.render('admin/nova-vaga',{categorias});
})

app.post('/admin/vagas/nova',async(req,res)=>{
     const {titulo,descricao,categoria}= req.body; 
    const db=await dbConnection;
  await db.run(`insert into vagas(categoria,titulo,descricao) values('${categoria}','${titulo}','${descricao}');`);
 res.redirect('/admin/vagas');
})

app.get('/admin/vagas/editar/:id',async(req,res)=>{
        
    const db=await dbConnection;
    const categorias= await db.all('select * from categorias');
    const vaga= await db.get('select * from vagas where id='+req.params.id);

    res.render('admin/editar',{categorias, vaga});
})

app.post('/admin/vagas/editar/:id',async(req,res)=>{
    const {titulo,descricao,categoria}= req.body; 
    const {id}=req.params;
   const db=await dbConnection;
 await db.run(`update  set vagas categoria='${categoria}',titulo='${titulo}',descricao='${descricao}' where id='${id}'`);
res.redirect('/admin/vagas');
})


const init= async ()=>{
    const db= await dbConnection
   // await db.run("CREATE TABLE if not exists categorias( id INTEGER PRIMARY KEY,categoria TEXT);");
   // await db.run("CREATE TABLE if not exists vagas( id INTEGER PRIMARY KEY,categoria INTERGER,titulo TEXT,descricao TEXT);");
   // const categoria='Marketing Team';
   // await db.run(`insert into categorias(categoria) values('${categoria}');`);

  // const vaga='Lider Marketing';
  // const descricao='vaga para inicio imediato';
  //  await db.run(`insert into vagas(categoria,titulo,descricao) values(2,'${vaga}','${descricao}');`);
}
init();
app.listen(3000,(erro)=>{
    if (erro) {
        console.log('entrou um erro');
    }else{
        console.log('rodando normalmente');
    }
})