$(function () {

    // 点击链接显示注册界面
    $('#link_reg').on('click', function (e) {
        $('.login-box').hide();
        $('.reg-box').show()
    })

    // 点击链接显示登录界面
    $('#link_login').on('click', function (e) {
        $('.login-box').show();
        $('.reg-box').hide()
    })

    //从layui中获取form对象
    var form = layui.form;

    // 从layui中获取layer对象
    var layer = layui.layer;

    // 通过 form.verify 函数自定义校验规则
    form.verify({
        // 自定义密码校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 检验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 之后进行一些等于的判断
            // 如果判断失败，则return一个提示消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });

    // 获取注册表中的 用户名 密码
    var data = {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
    }

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {

        // 阻止表单的默认行为
        e.preventDefault();

        // 发起注册请求
        $.post('/api/reguser', data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');

                // 模拟人的点击行为
                $('#link_login').click()

            })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {

        e.preventDefault()

        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg(response.message)
                }
                layer.msg('登录成功')
                console.log(response.token);
                // 将登录成功后得到的TOKEN值存到locationStorage
                localStorage.setItem('token', response.token)

                // 跳转到后台主页
                location.href = '/index.html'

            }
        });
    })
})