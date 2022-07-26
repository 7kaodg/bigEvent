$(function() {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    template.defaults.imports.formatDate = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = parseZero(dt.getMonth() + 1);
        let d = parseZero(dt.getDate());

        let hh = parseZero(dt.getHours());
        let mm = parseZero(dt.getMinutes());
        let ss = parseZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function parseZero(n) {
        return n > 9 ? n : '0' + n;
    }
    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-tb', res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            }
        });
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-search', res);
                $("[name=cate_id]").html(htmlStr);
                form.render('select');
            }
        });
    }

    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name=cate_state]").val();
        initTable();
    });

    function renderPage(total) {
        laypage.render({
            elem: 'page-box',
            count: total,
            limit: q.pagesize,
            curr: location.hash.replace('#!fenye=', '') //获取起始页
                ,
            hash: 'fenye', //自定义hash值
            limits: [2, 5, 10],
            layout: ['count', 'prev', 'page', 'next', 'limit'],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    $("tbody").on("click", "#btn-delete", function() {
        let id = $(this).attr("data-id");
        let len = $(this).length;
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    if (len == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });

    });

    $("#btn-publish").on("click", function() {
        window.parent.clickLink.artPub();
    });

    $("tbody").on("click", "#btn-edit", function() {
        window.parent.ID = $(this).attr('data-id');
        location.href = '/article/art_modify.html';
    });
});