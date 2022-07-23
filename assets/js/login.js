$(function() {
    // 去注册按钮
    $("#link_reg").on("click", function() {
        // $("#link_login").show();
        // $(this).hide();
        $(".login-box").hide();
        $(".reg-box").show();
    });
    // 去注册按钮
    $("#link_login").on("click", function() {
        // $("#link_reg").show();
        // $(this).hide();
        $(".login-box").show();
        $(".reg-box").hide();
    })

    const form = layui.form;
    const layer = layui.layer;

    // 自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            let pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });

    // 监听注册表单事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                'username': $(".reg-box [name=username]").val(),
                'password': $(".reg-box [name=password]").val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $("#link_login").click();
            }
        });
    })

    // 监听登录表单事件
    $("#form_login").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        });
    })

});