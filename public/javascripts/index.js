function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
var id,scroll=0,count=0,status=1; //true xuoi false nguoc
function senduserid(id) {
    $.post('/user', {
        userid:id,
        scroll:scroll
    },function(ketqua) {
        for(item of ketqua.data)
        {
           $('#content').append(`<tr style="color: #ffffff;"><th scope="row">${count}</th><td onclick="OpenInNewTabWinBrowser('${item.option}')">${item.name}</td><td>${item.url}</td><td><input onclick="changee(this)" id="${item.pos}" type="checkbox"></td></tr>`);
           if(item.ok)
           {
               $('#'+item.pos).prop('checked',true);
           }
           count++;
        }
        scroll+=ketqua.data.length;
    });
}
function senduserid_rev(id) {
    $.post('/user/rev', {
        userid:id,
        scroll:scroll
    },function(ketqua) {
        ketqua.data.reverse()
        for(item of ketqua.data)
        {
           $('#content').append(`<tr style="color: #ffffff;"><th scope="row">${count}</th><td onclick="OpenInNewTabWinBrowser('${item.option}')">${item.name}</td><td>${item.url}</td><td><input onclick="changee(this)" id="${item.pos}" type="checkbox"></td></tr>`);
           if(item.ok)
           {
               $('#'+item.pos).prop('checked',true);
           }
           count++;
        }
        scroll+=ketqua.data.length;
    });
}
function soabaiok() {
    $.post('/sobai/ok',{},function (result) {
        console.log(result)
        for(item of result.success)
        {
            $('#content').append(`<tr style="color: #ffffff;"><th scope="row">${count}</th><td onclick="OpenInNewTabWinBrowser(${item.option})">${item.name}</td><td>${item.url}</td><td><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></td></tr>`);
            count++;
        }
        scroll+=result.success.length;
    })
}
function OpenInNewTabWinBrowser(url) {
    var win = window.open(url, '_blank');
    win.focus();
}
function changee(evt) {
    console.log($(evt).attr('id'))
    $.post('/change',{id:$(evt).attr('id')},function (data) {
        console.log('ok')
    })
}
$(document).ready(function () {

    var cookies;
    if((cookies=getCookie('userid'))!='')
    {
        id=cookies;
        senduserid(id);
    }
    else
    {
        swal({
            title:"Dang nhap",
            text:"Vui long nhap userid",
            icon:'error',
            content:'input',
            button:'Dang nhap'
        })
            .then(function (value) {
                document.cookie=`userid=${value}`;
                id=value;
                senduserid(id);
                swal({
                    title:"Dang nhap",
                    text:"Ban da dang nhap thanh cong voi :"+value,
                    icon:"success",
                    button:true
                })
            })
    }
    $('#load-more').click(function () {
        console.log(status)
        if(status>0)
        {
            if(status==1)
            {
                senduserid(id);
            }
            if(status===2)
            {
                soabaiok();
            }
        }
        else
        {
            senduserid_rev(id);
        }
    })
    $('#giamdan-dokho').click(function () {
        $('#load-more').prop('hidden',false);
        $('tbody').empty();
        scroll=0;
        count=0;
        status=0;
        senduserid_rev(id);
    })
    $('#tangdan-dokho').click(function () {
        $('#load-more').prop('hidden',false);
        $('tbody').empty();
        scroll=0;
        count=0;
        status=1;
        senduserid(id);
    })
    $('#sobai-ok').click(function () {
        $('tbody').empty();
        scroll=0;
        count=0;
        status=2;
        soabaiok();
        $('#load-more').prop('hidden',true);

    });
    $('#logout').click(function () {
        document.cookie="userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location='/'
    })
    $('#sobai-todo').click(function(){
        swal({
                    title:"WARNING",
                    text:"Tác giả lười không làm tiếp !!",
                    icon:"warning"
            })
    })
    function search_index(key)
    {
        $.post('/search',{key:key},function(result){
            $('#search-result').empty()
            for(item of result.success)
            {
                let temp=`<tr><td scope="row">${item.url}</td> <td scope="row">${item.name}</td></tr>`
                $('#search-result').append(temp);
            }
        })
    }
    $.typeahead({
    input: '.js-typeahead-country_v1',
    order: "asc",
    href: "/search/{{display|slugify}}/",
    template:function(query,item){
        var a="<div class='row'><div class='col-9'>{{name}}</div>"
        +"<div class='col-3'><input id='{{pos}}' checked type='checkbox'>  {{url}}</div></div>";
        var b="<div class='row'><div class='col-9'>{{name}}</div>"
        +"<div class='col-3'><input id='{{pos}}' type='checkbox'>  {{url}}</div></div>";
        if(item.ok)
        {
            return a;
        }
        else
        {
            return b;
        }
    },
    emptyTemplate: 'No result for "{{query}}"',
    source: {
        name:{
            display: "name",
            href: "{{option}}",
            ajax: function(query)
            {
                return {
                type: "POST",
                url: "/search",
                data: {
                    key: $('input.js-typeahead-country_v1').val()
                },
                callback:{
                    done:function(data){
                        var res=[];
                        for(item of data)
                        {
                            res.push(item.name);
                        }
                        return data;
                        }
                    }
                }
            }
        }
    },
    callback: {
        onInit: function (node) {
            console.log('Typeahead Initiated on ' + node.selector);
        }
    }
    });
})