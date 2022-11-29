const { name } = require('ejs');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
//require('dotenv').config();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({extended: true}));
let db;

app.use('/', require('./routes/book.js'));

MongoClient.connect('mongodb+srv://rladhkdwls520:rlaguswls0520@cluster0.byq3uhl.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true}, (err, client)=>{
    if(err) return console.log(err);

    console.log('db 개같이 돌아가기 시작함ㅋㅋ');
    db = client.db('Guest_Book');

    app.listen(8080, ()=>{
        console.log('서버 돌아간다잉~');
    });
});

app.get('/', (req, res)=>{
   // res.sendFile(__dirname + '/views/home.html');
    res.render('home');
});

app.get('/write',(req, res)=>{
   // res.sendFile(__dirname + '/views/write.html');
    res.render('write');
});

/** 방명록 현재 시간을 리턴하는 함수, 한국기준 년월일시분임 */
function time(){
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr =  new Date(utc + (KR_TIME_DIFF));
    let year = kr_curr.getFullYear();
    let month = kr_curr.getMonth() + 1;
    let date = kr_curr.getDate();
    let hour = kr_curr.getHours();
    let min = kr_curr.getMinutes();
    let hour_division;
    
    if(hour / 12 == 1)
    {
        hour_division = "오후";
        hour = hour%12;
    }
    else
    {
        hour_division = "오전";
        hour = hour%12;
    }
    
    let last_date = year +"년 " +month +"월 " +date +"일 ";
    let last_time = hour_division+" "+ hour+"시 "+ min +"분 ";
    let gogo = last_date + last_time;
    return gogo;
}


app.post('/add', (req, res)=>{   
    if((req.body.name.trim()=="") || (req.body.name == null) || (req.body.title.trim()=="") || (req.body.title == null))
    {
       return res.send("<script>alert('빠진 거 좀 채워주십쇼 ㅋㅋ');location.href='/write';</script>");
    }

    db.collection('counter').findOne({name: '게시물갯수'}, (err, result)=>{
        if(err) return console.log(err);
       
        let totalcount = result.totalPost;

        let curr_time = time();
        db.collection('Contents').insertOne({_id: totalcount +1, 이름: req.body.name, 내용: req.body.title, 날짜:curr_time}, (err, result)=>{
            if(err) return console.log(err);
            console.log('complete');

            db.collection('counter').updateOne({name: '게시물갯수'}, {$inc : {totalPost:1}}, (err, result)=>{
                if(err) return console.log(err);
                res.redirect('/list');
            });
        });
    });
});

app.get('/list',(req, res)=>{
    db.collection('Contents').find().toArray((err, result)=>{
        if(err) return console.log(err);
        res.render('list.ejs', {contents : result});
    });
});


