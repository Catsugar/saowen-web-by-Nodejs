$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var li = $('.item-' + id);
        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/back/admin?id='+id,
        })
        .done(function (results) {
            if (results.success === 1) {
                if (li.length > 0) {
                    li.remove();
                }
            }
        });
    });
    $('.cancel').click(function (e) {
        var target = $(e.target);
        var tid = target.data('tid');
        var uid = target.data('uid');
        var li = $('.item-' + tid);
        $.ajax({
            type: 'POST', // 异步请求类型：删除
            url: '/back/cancel?tid='+tid+'&uid='+uid
        })
        .done(function (results) {
            if (results.success === 1) {
                if (li.length > 0) {
                    li.remove();
                }
            }
        });
    });
    //小说加入文单按钮
    $('.lovebtn').click(function (e) {
        var target = $(e.target);
        var tid = target.data('tid');
        var uid = target.data('uid');
        console.log("**************tid---"+tid);
        console.log("**************uid---"+uid);
        $.ajax({
            type: 'POST', 
            url: '/back/love?tid='+tid+'&uid='+uid
        })
        .done(function (results) {
            if (results.success === 1) {
                $('myLoved').modal('show');
            }
        });
    });
    /*$('.reply').click(function (e) {
        var target = $(this);
        var tid = target.data('tid');
        var cid = target.data('cid');
        $('<input>').attr({
            type: 'hidden',
            id: 'toId',
            name: 'comment[tid]',
            value: toId
        }).appendTo('.replybox');
        $('<input>').attr({
            type: 'hidden',
            id: 'commentId',
            name: 'comment[cid]',
            value: commentId
          }).appendTo('.replybox');
      })*/
});