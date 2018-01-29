var express = require('express');
var router = express.Router();
var crawler=require('crawler');
var USER=require('../model/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/user',function (req,res) {
    USER.Find(req.cookies.userid)
        .then(function (data) {
            if(Number(req.body.scroll)||Number(req.body.scroll)===0)
            {
                let result=[];
                let b=Number(req.body.scroll);
                for(let a=b;a<(b+20<express.list.length?b+20:express.list.length);a++)
                {
                    result.push(express.list[a]);
                    if(data[0]&&data[0].queue.length) {
                        result[result.length - 1].ok = data[0].queue[a];
                    }
                    result[result.length-1].pos=a;
                }
                res.send({success:true,data:result})
            }
            else
            {
                res.status(404).end('not found');
            }
        })
        .catch(function (err) {
            console.log(err);
        })
})
router.post('/user/rev',function (req,res) {
    USER.Find(req.cookies.userid)
        .then(function (data) {
            if(Number(req.body.scroll)||Number(req.body.scroll)===0)
            {
                let result=[];
                let b=Number(req.body.scroll);
                let x=express.list.length-b;
                for(let a=(x-20>=0?x-20:0);a<x;a++)
                {

                    result.push(express.list[a]);
                    if(data[0]&&data[0].queue.length) {
                        result[result.length - 1].ok = data[0].queue[a];
                    }
                    result[result.length-1].pos=a;
                }
                res.send({success:true,data:result})
            }
            else
            {
                res.status(404).end('not found');
            }
        })
        .catch(function (err) {
            console.log(err);
        })
})
router.post('/sobai/ok',function (req,res) {
    if(req.cookies.userid)
    {
        console.log(req.cookies.userid)
        USER.Find(req.cookies.userid)
            .then(function(data){
                let result=[];
                for(let i=0;i<data[0].queue.length;i++)
                {
                    if(data[0].queue[i])
                    {
                        let temp=express.list[i];
                        temp.pos=i;
                        result.push(temp);
                    }
                }
                res.send({success:result});
            })
            .catch(function(err){
                res.status(500).end(err);
            })
    }
    else
    {
        res.status(300).end({});
    }
})
router.post('/change',function (req,res) {
    var a=Number(req.body.id)?Number(req.body.id):-1;
    if(a!=-1)
    {
        USER.Find(req.cookies.userid)
            .then(function (data) {
                if(data[0]&&data[0].queue)
                {
                    data[0].queue[a]=!data[0].queue[a];
                    USER.CreateorUpdate(req.cookies.userid,data[0].queue);
                    res.end();
                }
                else{
                    USER.CreateorUpdate(req.cookies.userid);
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }
})
router.post('/search',function(req,res){
    
    if(req.cookies.userid)
    {
        console.log(req.cookies.userid)
        USER.Find(req.cookies.userid)
            .then(function(data){
                var temp=[];
                for(let index=0;index<express.list.length;index++){
                    //if(express.list[index].name.includes(req.body.key))
                    {
                        temp.push(express.list[index]);
                        temp[temp.length-1].pos=index;
                        temp[temp.length-1].ok=data[0].queue[index];
                    }
                }
                res.send(temp);
            })
            .catch(function(err){
                res.status(500).end(err);
            })
    }
    else
    {
        res.status(300).end({});
    }
})
module.exports = router;
