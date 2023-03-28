import { Sequelize } from "sequelize";
import express from "express"
const app = express()
var cors = require('cors')


const PORT = 4000;


app.use(express.json())

app.use(
    cors({origin: ['https://wizard-man.site/', 'https://ladder.wizard-man.site/']})
  );

const DB_NAME = 'wizardman'
const USER_NAME = 'root'
//const PASSWORD = ''
const PASSWORD = 'password'

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


