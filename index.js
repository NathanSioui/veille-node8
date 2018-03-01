const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient // le pilote MongoDB
const ObjectID = require('mongodb').ObjectID;
const peupler = require("./mes_modules/peupler");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const i18n = require("i18n");



i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' })

   app.use(i18n.init);

app.set('view engine', 'ejs'); // générateur de template 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));


app.set('view engine', 'ejs');


////////////////////////////////////////////////////////////////////////////// I18N


app.get('/:locale(en|fr)',  (req, res) => {
  // on récupère le paramètre de l'url pour enregistrer la langue

  let back = req.get('referer');
  console.log(req.params.locale);
 
 if(req.params.locale === "undefined"){
    res.cookie('langueChoisie',"fr");
     res.setLocale("fr")
  }else{
     res.cookie('langueChoisie',req.params.locale); 
     res.setLocale(req.params.locale)
  }
 
  console.log(back);

 res.redirect(req.get('referer'));

})

/////////////////////////////////////////////////////////////////////////////

app.get('/',function(req, res){

 res.render('gabarit.ejs', {acc: true})
})

////////////////////////////////////////////////////////////////////////////////

app.get('/liste',function(req, res){

var cursor = db.collection('adresses').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('gabarit.ejs', {ex_6: resultat})
})
})


////////////////////////////////////////////////////////////////////////////////

app.get('/rechercher',function(req, res){

console.log(req.query);

var cursor = db.collection('adresses').find({$or:[{nom : req.query.rechercher},{prenom : req.query.rechercher},{email : req.query.rechercher},{telephone : req.query.rechercher}]}).toArray(function(err, resultat){

 if (err) return console.log(err)

 res.render('gabarit.ejs', {ex_6: resultat, recherche : true})

})
})

////////////////////////////////////////////////////////////////////////////////

app.get('/profil/:id',(req, res) =>{

    var id = req.params.id
 console.log(id)
 db.collection('adresses').find({_id: ObjectID(req.params.id)}).toArray(function (err, resultat) {
console.log(resultat);
if (err) return console.log(err)
  res.render('gabarit.ejs', {personne: resultat, profil: true}) // redirige vers la route qui affiche la collection
 })

})


/////////////////////////////////////////////////////////////////////////////

app.get('/ajouter', function (req, res) {
 // Preparer l'output en format JSON

 console.log(req.query);

if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
	req.query = {
		prenom: ' ',
		nom: ' ',
		telephone: ' ',
		email: ' '
	}
}

 db.collection('adresses').save(req.query, (err, result) => {
 if (err) return console.log(err)
 console.log()

	
 res.redirect('/liste')
 })

});

//////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/suprimer/:id', (req, res) => {
 var id = req.params.id
 console.log(id)
 db.collection('adresses').findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/liste')  // redirige vers la route qui affiche la collection
 })
})

///////////////////////////////////////////////////////////////////////////////////////////////

app.post('/modifier', (req, res) => {

//console.log('req.body' + req.body)
console.log('***********************')
console.log( req.body['_id']);

 var oModif = {
 "_id": ObjectID(req.body['_id']), 
  nom: req.body.nom,
 prenom:req.body.prenom, 
 telephone:req.body.telephone,
 email:req.body.email
 }

 console.log(oModif);

  db.collection('adresses').save(oModif, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/liste')
 })

 })

////////////////////////////////////////////////////////////////////////////////////////////

 app.get('/trier/:cle/:ordre', (req, res) => {
console.log(req.params.ordre)
 let cle = req.params.cle
 let ordre = (req.params.ordre == 'asc' ? 1 : -1)
 let cursor = db.collection('adresses').find().sort(cle,ordre).toArray(function(err, resultat){

 ordre = (req.params.ordre == 1 ? 'desc' : 'asc')

 res.render('gabarit.ejs', {ex_6: resultat, cle_html:cle, ordre_html:ordre})

})
})


////////////////////////////////////////////////////////////////////////////////////////////////

 app.get('/peupler', (req, res, next) => {

 let aPeupler = peupler();

 for(let elm of aPeupler){
 	db.collection('adresses').save(elm,(err, result) => {

 		if(err) return console.log(err)
      
 	})
 }
 
  console.log("fin boucle");
  //next();
  res.redirect('/liste')

})

//////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/vider', (req, res) => {

  db.collection('adresses').remove( { }, (err,result) =>{
  	console.log('base de données vide!');
  } );
  res.redirect('/liste')

})



/////////////////////////////////////////////////////////////////////////////////////////////


let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})
