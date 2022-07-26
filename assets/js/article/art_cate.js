$(function() {
    const layer = layui.layer;
    const form = layui.form;
    initCateList();

    function initCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
            }

        });
    }
    let indexAdd = null;
    $("#btnAdd").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $("#add-box").html()
        });
    });

    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initCateList();
                layer.msg(res.message, { 'icon': 4 });
                layer.close(indexAdd);

            }
        });
    });
    $("body").on("click", "#cancel", function() {
        layer.close(indexAdd);
    });

    let indexEdit = null;
    $("tbody").on("click", "#btn-edit", function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $("#edit-box").html()
        });
        let id = $("#btn-edit").attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('form-edit', res.data);
            }
        });
    });

    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message, { 'icon': 1 });
                layer.close(indexEdit);
            }
        });
    });
    $("body").on("click", "#cancel-1", function() {
        layer.close(indexEdit);
    });

    $("tbody").on("click", "#btn-delete", function() {
        let id = $(this).attr("data-id");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message)
                    layer.close(index)
                    initArtCateList()
                }
            });
        });
    });
});