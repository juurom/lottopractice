const express= require('express')
const app = express();
const cors = require('cors')
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require('body-parser');
const _ = require('lodash');

app.use(cors({ credentials: true, origin: "http://localhost:5000" }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const MONGO_URI='mongodb+srv://juyeon:sogang20190047@cluster0.anefahj.mongodb.net/?retryWrites=true&w=majority'
const PORT = 5000;



app.listen(PORT, () => console.log(`${PORT}포트입니다.`));

const mongoose = require('mongoose');
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB conected'))
  .catch((err) => {
    console.log(err);
  });

// 스키마 정의
const lotto = mongoose.Schema({
    index: Number,
    date: String,
    firstWinner: Number,
    firstPrize: String,
    winNum: [Number],
    versionKey: false,
    });

const Lotto = mongoose.model('Schema', lotto);


async function getHtml(){
  try {
    return await axios.get("https://signalfire85.tistory.com/28");
  } catch (error) {
    console.error(error);
  }
};

// 이미 데이터를 저장했으면 더이상 받아오지 않음
async function readDB(){
  let promise = new Promise((resolve, reject)=>{
    Lotto.find((error, data)=>{
      console.log(data.length==0)
      if (data.length==0) {
        resolve(true);
      }
      else resolve(false);
   })
  })
  let empty = await promise;
  if (empty){
    getHtml()
    .then(html=>{
  
      const $ = cheerio.load(html.data);
      const $bodyList = $("tbody").children("tr");  
  
      $bodyList.each(function(i, elm) {
        if (i>2) { //첫두줄은 내용 없음
          elements=['',]; //index 0 헷갈리니까 빈데이터 삽입
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
            if (error){
              console.log(error);
            }else{
              //console.log(data)
            }
          });
        }
    })
    })
  
  }
}

readDB();

  

app.get('/getAll',(req,res)=>{
  Lotto.find().sort({'index':1}).exec((error, lotto)=>{
    if (error){
      console.log(error);
    }else{
      console.log(lotto);
      res.json(lotto);
    }
  });
})


let win=[];

app.post('/numCheck',(req,res)=>{
  win = [0, {index:0, date: 0, firstWinner: 0, firstPrize: 0, winNum:[]}];
  const inputs=(req.body.inputs);
  inputs.sort();
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
  })*/

  //mongodb
  //https://javafa.gitbooks.io/nodejs_server_basic/content/chapter12.html

  


  