$(function() {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length < 6) {
                return '昵称必须大于6个字符！';
            }
        }
    });
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('formUserInfo', res.data);
            }
        });
    }

    $("#btnReset").on("click", function(e) {
        e.preventDefault();
        initUserInfo();
    });

    $("#form-user").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新用户信息成功！')
                window.parent.getUserInfo();
            }
        });
    });
});