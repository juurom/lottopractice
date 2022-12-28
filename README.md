# lottopractice
2022-2 CSE4177 인터넷프로그래밍응용 강의 term project , MERN stack Crawling Project입니다.

동일한 내용을 [velog](https://velog.io/@juurom/%ED%86%A0%EC%9D%B4%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%AA%A8%EC%9D%98%EB%A1%9C%EB%98%90-%EA%B7%B8%EB%95%8C-%EA%B7%B8%EB%9E%AC%EB%8D%94%EB%9D%BC%EB%A9%B4)에서 보실 수 있습니다.

> 👀 크롤링(스크래핑)으로 받아온 데이터를 활용한 토이프로젝트

# 📌목차
- [소개](#소개)
  - [기획 의도](#기획-의도)
  - [기술 스택](#기술-스택)
  - [주요 기능](#주요-기능)
  - [UI 및 소스](#UI-및-소스)
- [구현 항목](#구현-항목)
  - [백엔드](#백엔드)
  - [프론트엔드](#프론트엔드)
- [배운점 및 배울점](#배운점-및-배울점)


# 📌소개
## ◽ 기획-의도 
학교 과제로 MERN 스택을 통해 크롤링한 웹페이지 만들기가 나왔다.
("크롤링"이라고 하셨는데 개념이 불분명해서 교수님께 여쭤 보니
"다른 웹페이지에 있는 정보를, 태그를 통해 가져오는 것"이라고 설명하셨다.
본 프로젝트에서 한 것은 하나의 웹페이지에서 정보를 받아오는 것 정도라서
스크래핑에 더 가까울 것 같다.)

다른 페이지에서 많은 정보를 가져와서 DB에 저장하고 검색해보는 것을 하기 위해 어떤 데이터를 집어넣을까... 하다가 동행복권 로또번호로 해보기로 했다.
로또번호로 한 이유는, 검색 조건에서 단순 일치하는 항목만 찾아보는 것보다는 1등, 2등, 3등<span style="color:violet"> 각각의 조건에 맞게 로직을 넣어서 검색</span>해보고 싶었기 때문이다.

_<span style="color:grey">사실 동행복권 사이트에 들어가면 모든 회차 당첨번호와 당첨금을 액셀파일로 받아볼 수 있다. 그러나 크롤링이 필요한 과제였기 때문에 당첨금이 표로 정리된 블로그를 찾아서 수행했다.
  </span>_

## ◽ 기술-스택
- MongoDB
- Express
- React
- NodeJS

## ◽ 주요-기능
1. 번호 7자리를 입력한다.
2. 3등까지, 내가 입력한 번호가 언제 몇등으로 당첨이었는지 알 수 있다. 1등인 경우는 당첨금과 함께 알 수 있다.
3. 누적 트라이 횟수가 기록된다.

## ◽ UI-및-소스
![](https://velog.velcdn.com/images/juurom/post/7e6b97d1-55a8-423f-b8d4-f3f7c6eca0ec/image.png)![](https://velog.velcdn.com/images/juurom/post/876983cb-80d5-4329-9267-8b4393fd2c2c/image.png)![](https://velog.velcdn.com/images/juurom/post/6c59b0a7-ff9a-4653-a80e-c493a8095db6/image.png)![](https://velog.velcdn.com/images/juurom/post/39a108f5-9fac-44b5-88a0-97125557d775/image.png)![](https://velog.velcdn.com/images/juurom/post/6d70a3e8-0e7e-48c6-8146-35e44b5202f0/image.png)


Source : [Github](https://github.com/juurom/lottopractice)
_<span style="color:grey">(원래는 배포해서 링크 걸어두려고 했는데 배포에 실패한 관계로 UI만 소개한다.ㅜㅜ)</span>_

# 📌구현-항목

## 🎭백엔드
### 1. axios API를 통한 http 비동기 통신

스크래핑 대상 사이트에 대해 get, DB 데이터를 프론트에 보내주는 get, 프론트의 입력값을 받아 DB를 검색하는 post를 사용하였다.

첫 번째 get은 스크래핑 대상 사이트에 get요청을 보내는 것이다. `filldB()` 함수는 DB에 스크래핑한 데이터를 집어넣는 역할이다. 바로 다음 항목에서 자세히 설명한다.
```js
const fillDB = async()=>{
  const html = await axios.get("https://signalfire85.tistory.com/28");

```
두 번째 get은 DB 데이터를 프론트에 보내주는 역할이다.
DB로부터 모든 데이터를 찾기 위해 조건 없이 `find`를 해 준다.
그리고 데이터가 역순으로 정리되어 있어, 회차수를 기준으로 오름차순 정렬을 한다.
받아온 모든 데이터를 `res.json`으로 보내준다.

```js
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
```
post는 `req.body`를 읽어와서 사용자 입력값을 array로 바꾼다. 프론트에서는 아래와 같이 데이터를 보낸다.
```jsx
const json = await axios.post(SERVER_URL+'/numCheck', {inputs}) 
```
따라서 `req.body`는 아래와 같은 형태이다.
```
{
  inputs: [
     9, 13, 21, 25,
    32, 42,  2
  ]
}
```
여기서 내가 필요한 데이터는 `req.body.inputs`라는 것을 알 수 있다.

```js
app.use(express.json()) // req.body를 json 데이터로 바꾸어 준다. bodyParser과 같은 역할.

//...

app.post('/numCheck',(req,res)=>{
  const inputs=(req.body.inputs);
//이하 생략
```



### 2. mongoDB 스키마에 따른 데이터 삽입 및 탐색
받아온 데이터를 구조에 맞게 저장하고 검색한다. mongoose 공식문서에 나오는 MongoDB 연결방법을 따라해준다.
```js
const mongoose = require('mongoose');
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB conected'))
  .catch((err) => {
    console.log(err);
  });
```
다음으로 스키마를 정의해준다. 스키마는 데이터 구조 ,즉 필드 타입에 관한 정보를 JSON 형태로 정의한 것으로 RDBMS의 테이블 정의와 유사한 개념이다. ([출처](https://poiemaweb.com/mongoose)) 스키마는 noSQL의 높은 자유도로 인해 원치않은 데이터까지도 validation 없이 저장되는 단점을 보완한다.

```js
const lotto = mongoose.Schema({
    index: Number,
    date: String,
    firstWinner: Number,
    firstPrize: String,
    winNum: [Number],
    versionKey: false, //__v라는 필드가 자동으로 나타나는데 없애려면 이 속성을 추가해준다
    });

const Lotto = mongoose.model('Schema', lotto);//스키마를 변수로서 사용
```


### 3. cheerio API를 통한 웹 스크래핑
로또 번호 데이터를 받아오기 위해 html 태그를 이용한 웹 스크래핑을 한다.
먼저 스크래핑을 할 사이트의 html 태그 구조를 살펴본다. 개발자 도구(F12)를 켜서 필요한 요소의 태그를 확인한다.
![](https://velog.velcdn.com/images/juurom/post/5fb9917a-6d83-4b88-acf9-a5dfe890c25a/image.png)![](https://velog.velcdn.com/images/juurom/post/92582d7f-78cd-4ecb-be73-35d437bc7499/image.png)![](https://velog.velcdn.com/images/juurom/post/05816e3e-abd7-4e32-832a-4b428bfa4d84/image.png)
`tbody`의 child요소 중 `tr`들을 가져오면 된다.

`tr`의 하위 요소에는 어떻게 접근할까 고민해보았다. class 명으로 접근하기에는 공통점이 없는데도 겹치는 것이 있었다. 
![](https://velog.velcdn.com/images/juurom/post/8e396af1-2c75-4713-8bb8-351124d53e48/image.png)
대신 데이터가 표로 정리되어 있어서 `tr` child에는 모두 [회차, 추첨일, 당첨자수, 당첨금액, 당첨번호] 순으로 저장이 되어 있었다. 그래서 모든 `tbody` > `tr` 요소들을 `nth-of-type()`로 받아왔고 여기에 대해 `forEach`문을 돌면서 데이터를 집어넣어주었다.
cheerio 사용법은 [여기](https://velog.io/@_nine/Node.js-Crawling-feat.-Cheerio)를 참고했다.

```js
const cheerio = require("cheerio");
//...
const fillDB = async()=>{
  const html = await axios.get("https://signalfire85.tistory.com/28");
  const $ = cheerio.load(html.data);
  const $bodyList = $("tbody").children("tr");  
  $bodyList.each((i, elm)=>{
    if (i<=2) { return; } //첫두줄은 넣어야 할 내용 없음
    
    elements=['',]; //index 0 있는 거 헷갈리니까 빈데이터 삽입
    for(let i=1; i<=11; i++){
      elements[i]=$(this).find(`td:nth-of-type(${i})`).text();
    }
    
    const newLotto = new Lotto({ //앞서 정의한 스키마에 따른 데이터 삽입
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

```

그런데 이대로만 두면 웹페이지를 리로드할 때마다 get 해오고, 또 get 해오고... 해서 데이터가 누적되었다. 사실 처음 페이지를 로드할 때만 DB에 데이터를 넣어두면 된다. 

```js
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

```




## 🎭프론트엔드

### 1. axios API를 통한 http 비동기 통신
서버에서 보내준 데이터를 받아온다.
모든 로또 당첨 정보를 받아오기만 할 때에는 get,
로또 당첨 정보를 검색할 때는 post를 이용했다.
1. get
/getAll로부터 모든 정보를 받아온다.
페이지가 처음 로드될 때만 실행하면 되므로 useEffect로 구현한다.

처음에는 이렇게 구현했다.
```jsx
useEffect(async() => {        
	const json = await axios.get(SERVER_URL+'/getAll')
    setLotto(json.data)
}, [])
```
그러나 위 코드를 사용하면 에러가 난다. 이유는 useEffect의 구조에 있다.

```jsx
useEffect(()=>{
	//마운트 시 실행
	return ()=>{
      //언마운트 시 실행 (클린업 함수)
    }
}, [의존값])
```

async는 필연적으로 Promise를 반환한다. 보이지는 않지만 useEffect의 return문 안에 Promise가 들어가 버린다! 즉 클린업 함수에 원치 않은 값이 들어간다는 것이다.
따라서 useEffect 밖에서 함수를 선언하고, useEffect 안에서는 호출만 하는 식으로 사용해주어야 한다.


```jsx
useEffect(() => {        
    getAll();
}, [])

const getAll=async()=>{
    const json = await axios.get(SERVER_URL+'/getAll')
    setLotto(json.data)
}
```

2. post

/numCheck에 사용자가 입력한 7자리 번호를 array로 만든 `inputs` 데이터를 보내서, inputs를 바탕으로 검색한 결과를 json으로 받아온다. 데이터를 받아오면 내 당첨결과를 `myLotto` div 안에 보여준다. `hide`는 css에서 `display:none` 해주어서 화면에 보이지 않게 하는 class로 썼다.
```jsx
const sendNumbers=async(inputs)=>{
    const json = await axios.post(SERVER_URL+'/numCheck', {inputs}) 
    setMyLotto(json.data);
    const message = document.getElementsByClassName("myLotto")[0];
    message.classList.remove('hide');
}
```



### 2. 페이지네이션 (페이징)
많은 양의 데이터를 여러 페이지로 나누어 특정 페이지 번호로 넘어갈 수 있게 한다. react-js-pagination 라이브러리를 사용했다. [(사용법 참고 블로그)](https://cotak.tistory.com/112)


먼저 코드가 길어진 게 불편해서 페이지네이션은 모듈화했다. 아래에서 lotto 변수는 스크래핑으로 가져온 데이터 array이다. props로 ShowAll 컴포넌트에 상속해 주었다.

- index.js
```jsx
<ShowAll data={lotto}/>
```

- ShowAll.js
```jsx
function ShowAll(props){
    const lotto=props.data;
  ///이하 생략
``` 
다음으로, react-js-pagination을 이용한 페이지네이션을 구현하기 위해, `npm i react-js-pagination`과 `import`를 해 주었다. 그리고 페이지네이션 컴포넌트를 불러왔다.
```jsx
<Pagination
    activePage={curpage}
    itemsCountPerPage={10}
    totalItemsCount={lotto.length}
    pageRangeDisplayed={10}
    onChange={handlePageChange}>
</Pagination>
```
프로퍼티의 의미는 각각 다음과 같다.
- activePage : 현재페이지
- itemsCountPerPage : 한 페이지당 보여줄 리스트 아이템 개수
- totalItemsCount : 총 아이템의 개수
- pageRangeDisplayed : 하단 페이지네이터에서 보여줄 페이지 범위
- onChange : 페이지가 바뀔 때 핸들링할 함수

onChange 안의 함수에 의해 curpage 값이 변한다. 기본값이 1인 state로 정의해주고 함수에 따라 setState해준다. handlePageChange에서 e는 콘솔로 확인해본 결과 클릭한 페이지 넘버가 나타난다. 따라서 setCurpage(e)로 클릭한 페이지 넘버에 따라 curpage가 변화할 수 있도록 했다.

```jsx
    const [curpage, setCurpage] = useState(1);

    const handlePageChange=(e)=>{
        setCurpage(e);
    }
```

다음으로 curpage에 따라 페이지에 보여주는 리스트를 바꿔준다.
10개씩 보여지도록 `array.slice()` 해주고 `array.map()`을 통해 div을 생성한다.
```jsx
        {lotto.slice((curpage-1)*10, (curpage)*10).map((lotto)=>(
            <div className="lottoEach">
                <div>{lotto.index}회</div>
                <div>{lotto.date}</div>
                <div>{lotto.firstPrize}</div>
                <div>{lotto.firstWinner}명</div>
                <div>
                    {(lotto.winNum)&&lotto.winNum.map((n)=><span className="winNum">{n}</span>)}
                </div>
            </div>
        ))}
```


- 결과화면
![](https://velog.velcdn.com/images/juurom/post/2e758c30-a638-4e17-ad97-222b68301220/image.png)




### 3. HTML5, JS를 통한 Input validation
사용자 input값이 조건에 맞는지 확인한다.

1. 빈 input이 존재하지 않는가?
HTML 5 self validation 에서 가능하다. input 태그 안에 `required` 속성을 추가해준다.
```jsx
<input className="numbers" type="text" required></input>
```
2. 입력값이 1~45 사이인가? / 중복되는 값이 존재하지 않는가?
form 제출 이벤트가 발생했을 때 validation을 할 수 있도록 onSubmitHandler 함수를 작성해준다.
```jsx
<form className="userinput" onSubmit={onSubmitHandler}>
  ///이하생략
```
onSubmitHandler 함수 내용은 다음과 같다.
입력한 7개의 숫자를 각각 newinput에 넣는다.
만약 newinput이 이미 inputs array에 포함돼 있거나, newinput이 1~45 사이가 아니라면
valerr 플래그를 true로 하고 반복을 멈춘다.

서로 다른 valmessage를 설정하려고 if문을 나누었다.
valerr 플래그가 false이면 valmessage를 지워준다.
```jsx
const onSubmitHandler=(e)=>{
    e.preventDefault();
    const inputs=[];
    let newinput = -1;
    let valerr = false;
    for (let i=0; i<7; i++){
        newinput= Number(e.target.children[i].value);
        if (inputs.includes(newinput)){
            setValmessage("중복값이 존재합니다.")
            valerr=true;
            break;
        }
        if (newinput<1 || newinput > 45){
            setValmessage("1~45 사이의 숫자를 선택하세요.")
            valerr=true;
            break;
        }
        inputs[i] = newinput;
    }
    
    if (!valerr) {
    setValmessage("")
    sendNumbers(inputs);
    }
}
```
- 결과화면
![](https://velog.velcdn.com/images/juurom/post/2d2d62bb-ef4e-4fb7-920c-b94d31d53885/image.png)![](https://velog.velcdn.com/images/juurom/post/f4cc2af5-a103-4615-bceb-7edd2331e4d5/image.png)![](https://velog.velcdn.com/images/juurom/post/83c512b0-e7b7-4378-aea9-c73fa82eff1e/image.png)



### 4. 자동번호 난수 생성
자동복권처럼, 1부터 45 사이의 난수를 생성해 input text 안에 넣어 준다.
버튼을 누르면 랜덤함수를 실행시키도록 한다.
```jsx
<button className="random" onClick={putRandom}>자동</button>
```
putRandom 함수 내용은 다음과 같다.
javascript Math 라이브러리를 이용해 난수를 생성한다.
난수는 0~1 사이의 수이므로 100을 곱해 세 자리 수를 만들고,
45로 나눈 나머지에 1을 더해서, 1~45 사이의 숫자가 되도록 만든다.
만든 난수는 randomarr에 넣고 input value값으로 정해준다.
난수가 이미 randomarr에 있다면 넣지 않고 다시 난수를 생성하기 위해 인덱스를 1 줄여준다.

```jsx
const putRandom=(e)=>{
    e.preventDefault();
    let newnum=0;
    const input = document.getElementsByClassName("numbers");
    let randomarr=[];
    for (let i=0; i<7; i++){
        newnum = Math.floor(Math.random()*100)%45+1;
        if (!randomarr.includes(newnum)){
            randomarr.push(newnum);
            input[i].value=newnum;
        }
        else{
            i--;
        }
    }
}
```
- 결과화면
![](https://velog.velcdn.com/images/juurom/post/f727d27d-f1cd-4603-8c77-c21f2e23876e/image.png)![](https://velog.velcdn.com/images/juurom/post/81863021-bed2-4bfb-b67a-7a2591605ba3/image.png)![](https://velog.velcdn.com/images/juurom/post/29366b08-e10e-4169-8138-7a8f58ce9dc9/image.png)


# 📌배운점-및-배울점

1. axios
배운점 : 처음으로 react와 nodejs 모두를 사용해서 무언가를 완성해 보았다. axios api를 통해 http 통신을 어느정도 할 수 있게 되었다.
배울점: get/post 말고 다른 메소드는 언제 어떻게 쓰이는지 실습해보아야겠다.
2. mongoDB
배운점 : 몽고디비 연동과 스키마 생성, 데이터 삽입 및 검색을 할줄 알게 되었다.
배울점 : 개념 자체가 덜 잡힌 느낌. 아직 몽고디비 Compass랑 Shell에서 뭘 할 수 있고 뭘 할 수 없는지를 잘 모른다. 조금 더 다루어봐야겠다.
3. React hooks
배운점 : useState와 useEffect는 언제 어떻게 사용해야 하는지 이제 완전히 이해한 것 같다!
배울점 : hook 중에서 아는 게 요거 두개 뿐이라... 다른 hook도 공부해보고 custom hook도 만들어보아야겠다.
4. 배포
배운점 : 배포가 쉽지 않구나 (ㅋㅋㅋㅠ)
배울점 : react로 프론트만 개발했을 때는 github pages로 배포도 간단하게 됐었는데 nodejs 서버도 개발하니까 aws로 따로 배포해야 하더라. 블로그 게시글 보고 따라해서 시도해봤으나 너무 알아야 할 게 많아서 포기했다... 과제 제출하고 만든 서비스를 aws로 배포하는 법에 대해 조금 더 공부해봐야겠다.

#### 여담![](https://velog.velcdn.com/images/juurom/post/a8398936-4d57-4ca9-82fe-6deddd10c742/image.png)
1등은 어지간히 운이 좋지 않은 이상 절대 안되는 모양이다... ㅎㅎ



