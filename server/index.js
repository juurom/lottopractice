const express= require('express')
const app = express();
const cors = require('cors')
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const MONGO_URI= process.env.MONGO_URI;

app.use(cors({ credentials: true, origin: "http://localhost:5000" }));
app.use(express.json())

const PORT = 5000;

app.listen(PORT, () => console.log(`${PORT}포트입니다.`));

const mongoose = require('mongoose');
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB conected'))
  .catch((err) => {
    console.log(err);
  });

const lotto = mongoose.Schema({
    index: Number,
    date: String,
    firstWinner: Number,
    firstPrize: String,
    winNum: [Number],
    versionKey: false,
    });

const Lotto = mongoose.model('Schema', lotto);

const fillDB=async()=>{
  const html = await axios.get("https://signalfire85.tistory.com/28");
  const $ = cheerio.load(html.data);
  const $bodyList = $("tbody").children("tr");  

  $bodyList.each((i, elm)=>{
    if (i<=2) { return; } //첫두줄은 내용 없음
    let elements=['',]; //index 0 헷갈리니까 빈데이터 삽입
    for(let i=1; i<=11; i++){
      elements[i]=$(this).find(`td:nth-of-type(${i})`).text();
    }

    const newLotto = new Lotto({
      index: Number(elements[1]),
      date: elements[2],
      firstWinner: Number(elements[3]),
      firstPrize: elements[4],
      winNum: [
        Number(elements[5]),
        Number(elements[6]),
        Number(elements[7]),
        Number(elements[8]),
        Number(elements[9]),
        Number(elements[10]),
        Number(elements[11]),
      ]
    });

    newLotto.save((error, data)=>{
      if (error) console.log(error);
      //else console.log(data);
    });
  });
}

const readDB = async()=>{
  let promise = new Promise((res, rej)=>{
    Lotto.find((error, data)=>{
      if (data.length==0) {
        res(true);
      }
      else res(false);
   })
  })
  let empty = await promise;
  if (empty){
    fillDB();
  }
}

readDB();

app.get('/getAll',(req,res)=>{
  Lotto.find().sort({'index':1}).exec((error, lotto)=>{
    if (error){
      console.log(error);
    }else{
      //console.log(lotto);
      res.json(lotto);
    }
  });
})

app.post('/numCheck',(req,res)=>{
  console.log(req.body);
  let win = [0, {index:0, date: 0, firstWinner: 0, firstPrize: 0, winNum:[]}];
  const inputs=(req.body.inputs);
  let winCount=0;
  let bonus=false;  
  Lotto.find({'winNum': {'$in': [...inputs]} },(error,lotto)=>{
    console.log('-------read found----------');
    if (error){
      console.log(error);
    }else{
      lotto.map((l)=>{
        winCount=0;
        bonus=false;
        //console.log(l.winNum);
        for(let i=0; i<6; i++){
          if (inputs.includes(l.winNum[i])){
            winCount++;
          }
        }
        if (inputs.includes(l.winNum[6])){
          bonus=true;
        }
        
        if (winCount==6){ 
          console.log(l)
          console.log("ㄴfirst prize")
          win=["1",l];
          console.log(win);
        }
        else if (winCount==5 && bonus){
          console.log(l)
          console.log("ㄴsecond prize")
          win=["2",l];
        }
        else if (winCount==5 && !bonus){
          console.log(l)
          console.log("ㄴthird prize")
          win=["3",l];
        }

      })
      return res.send(win); 
    }
  })
})


/*
  Lotto.remove({}, (error, data)=>{
    console.log("--------delete--------");
    if (error){
      console.log(error);
    }
  })
  */
  


  