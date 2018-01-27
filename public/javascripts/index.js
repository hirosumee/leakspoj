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
           $('tbody').append(`<tr style="color: #ffffff;"><th scope="row">${count}</th><td onclick="OpenInNewTabWinBrowser('${item.option}')">${item.name}</td><td>${item.url}</td><td><input onclick="changee(this)" id="${item.pos}" type="checkbox"></td></tr>`);
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
        for(item of ketqua.data)
        {
            $('tbody').append(`<tr style="color: #ffffff;"><th scope="row">${count}</th><td onclick="OpenInNewTabWinBrowser('${item.option}')">${item.name}</td><td>${item.url}</td><td><input onclick="changee(this)" id="${item.pos}" type="checkbox"></td></tr>`);
            count++;
        }
        scroll+=ketqua.data.length;
    });
}
function soabaiok() {
    $.post('/sobai/ok',{},function (result) {
        for(item of result.data)
        {
            $('tbody').append(`<tr style="color: #ffffff;"><th scope="row">${count}</th><td onclick="OpenInNewTabWinBrowser(${item.option})">${item.name}</td><td>${item.url}</td><td><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></td></tr>`);
            count++;
        }
        scroll+=result.data.length;
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
        if(status)
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
        $('tbody').empty();
        scroll=0;
        count=0;
        status=0;
        senduserid_rev(id);
    })
    $('#tangdan-dokho').click(function () {
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

    });
    $('#logout').click(function () {
        document.cookie="userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location='/'
    })
})