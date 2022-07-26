$(function() {
    const layer = layui.layer;
    const form = layui.form;
    let id = window.parent.ID;
    initCate();
    initEditor();
    initArtInfo();
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                const htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render('select');
            }
        });
    }
    $("#btnChooseImage").on("click", function() {
        $("#upload").click();
    });
    $("#upload").on("change", function(e) {
        if (e.target.files.length <= 0) {
            return layer.msg('请选择文件！', { 'icon': 5 });
        }
        let file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });
    var art_stats = '已发布';
    $("#saveDraft").on("click", function() {
        art_stats = '草稿';
    })
    $("#form-pub").on("submit", function(e) {
        e.preventDefault();
        let formdata = new FormData($("#form-pub")[0]);
        formdata.append('state', art_stats);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                formdata.append('cover_img', blob);
                formdata.append('Id', id);
                updateArticle(formdata);
            })


    });

    function updateArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { 'icon': 2 });
                }
                layer.msg(res.message, { 'icon': 1 });
                window.parent.clickLink.artList();
            }
        });
    }

    $("#goback").on("click", function() {
        window.parent.clickLink.artList();
    });

    function initArtInfo() {

        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('artInfo', res.data);
                // $('[name=title]').val(res.data.title);
                // $('[name=cate_id]').val(res.data.cate_id);
                // form.render();
                let newsImgURL = 'http://www.liulongbin.top:3007' + res.data.cover_img;
                tinymce.get('contents').setContent(res.data.content);
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newsImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域

            }
        });
    }


});