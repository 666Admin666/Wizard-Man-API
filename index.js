import { Sequelize } from "sequelize";
import express from "express"

const PORT = 4000;


const app = express()
app.use(express.json())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});

//const DB_NAME = 'wizardman'
const DB_NAME = 'd117276_db'
const USER_NAME = 'root'
const PASSWORD = ''
//const PASSWORD = 'password'

const ladder = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
}
})

const Users = ladder.define('users', {
    Id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Twitter: {
        type: Sequelize.STRING,
        allowNull: false
    },
    BitCoinWallet: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Score: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})


/* TEST WORKING SERVER */
app.get('/',(req,res)=>
{
    const check = "Server Is Working / V 0.3 Beta";
    res.status(200).send(check);
})

/* SCROLLS */
app.get('/ladder' ,async(req, res) => {
    try{
        const ladder  = await Users.findAll() 
        res.json(ladder);
        
    }catch(e){
        res.status(500).json(e);
    }
})
app.post('/ladder' ,async(req, res) => {
    try{
        const {Twitter , BitCoinWallet ,Score }  = req.body;
        const data = await Users.findOne({
            where:{
                Twitter:Twitter,
                BitCoinWallet:BitCoinWallet
            }
        })
        if (data !== null) {
            if (data.Score < Score) {
                await Users.update(
                    {
                        Score:Score
                    },{
                        where:{
                            Twitter:Twitter,
                            BitCoinWallet:BitCoinWallet
                        }
                    });
            } 
        }
        else{
            await Users.create({Twitter,BitCoinWallet,Score}) 
        }
        res.json("Success");
    }catch(e){
        res.status(500).json(e);
    }
})

async function start() {
    try {
      await ladder.sync()
      app.listen(PORT)
    } catch (e) {
      console.log(e)
    }
  }
  
start()


