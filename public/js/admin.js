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
        var id = target.data('id');
        var li = $('.item-' + id);
        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/back/love?id='+id,
        })
        .done(function (results) {
            if (results.success === 1) {
                if (li.length > 0) {
                    li.remove();
                }
            }
        });
    });
    /*if (isExist === 1) {
        $('#myAlert').modal('show');
    }*/
});