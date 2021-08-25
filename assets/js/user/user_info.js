$(function () {
    var form = layui.form;

    // 验证用户名称的验证规则
    form.verify({
        nickname: function (name) {
            if (name.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }

        }
    })

    // 调用函数
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {

        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')

                console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })

    }



    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault();

        // 还原为初始状态
        initUserInfo()

    })

    // 更新用户基本信息
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认的提交行为
        e.preventDefault()
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 1.利用layui中的form.val()方法获取表单数据
            // data: form.val('formUserInfo'),
            // 2.利用jquery中的serialize()方法获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户数据失败')
                }
                layui.layer.msg(res.message)
                initUserInfo()

                // ***调用父页面中的方法，渲染用户的基本信息
                window.parent.getUserInfo()

            }
        })
    })


})