var mongoose=require('mongoose');
mongoose.Promies=require('bluebird');
var schema=new mongoose.Schema({
    username:{type:String},
    queue:{type:Array}
})
schema.plugin(require('mongoose-create-or-update'));
var USER=mongoose.model('users',schema);
module.exports.CreateorUpdate=function (name,data) {
    var f=[];
    if(data&&!data.length) {
        for (let i = 0; i < 1000; i++) {
            f.push(false);
        }
        data=f;
    }
    USER.createOrUpdate({'username': name}, {'username':name,'queue':data})
        .then(function (res) {
            console.log(res._id);
        })
        .catch(function (err) {
            console.error(err);
        })
}
module.exports.Find=function (username) {
    return USER.find({'username':username});
}
