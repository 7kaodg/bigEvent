$(function() {
    const layer = layui.layer;
    getUserInfo();

    $("#btnLogout").on("click", function() {
        layer.confirm('确认退出?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    });

    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                renderAvatar(res.data);
            }
        });
    }

    function renderAvatar(data) {
        let _name = data.nickname || data.username;
        $("#welcome").html('欢迎：' + _name);
        if (data.user_pic !== null) {
            $(".layui-nav-img").attr("src", data.user_pic).show();
            $(".text-avatar").hide();
        } else {
            $(".layui-nav-img").hide();
            $(".text-avatar").html(_name[0].toUpperCase()).show();
        }
    }

});