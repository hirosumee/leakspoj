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

    if(Number(req.body.scroll)||Number(req.body.scroll)===0)
    {
        let result=[];
        let b=Number(req.body.scroll);
        for(let a=b;a<(b+20<express.list.length?b+20:express.list.length);a++)
        {
            result.push(express.list[express.list.length-1-a]);
        }
        res.send({success:true,data:result})
    }
    else
    {
        res.status(404).end('not found');
    }
})
router.post('/sobai/ok',function (req,res) {
    if(req.cookies.userid)
    {
        // var c=new crawler({
        //     callback : function (error, res, done) {
        //         if(error){
        //             console.log(error);
        //         }else{
        //             var $ = res.$;
        //             console.log('......')
        //             var a=$($($($('.table-condensed')[0]).children('tbody')).children('tr')).children('td').children('a');
        //             console.log(a)
        //             for(i=0;i<a.length;i++){console.log(a[i].text())}
        //         }
        //         done();
        //     }
        // });
        // c.queue('http://www.spoj.com/PTIT/users/'+req.cookies.userid);
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
module.exports = router;
