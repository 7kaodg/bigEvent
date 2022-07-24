$(function() {
    const layer = layui.layer;
    const form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samepwd: function(value) {
            let oldPwd = $("input[name=oldPwd]").val();
            if (oldPwd !== value) {
                return '新旧密码不能相同！';
            }
        },
        repwd: function(value) {
            let newPwd = $("input[name=newPwd]").val();
            if (newPwd !== value) {
                return '两次密码输入不一致！';
            }
        }
    });
    $("#btnReset").on("click", function(e) {
        e.preventDefault();
        $("#form-pwd")[0].reset();
    });
    $("#form-pwd").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
            }
        });
    })

});