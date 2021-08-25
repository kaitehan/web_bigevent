$(function () {
    var form = layui.form;

    // 设置表单校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: form.val('updatePwd'),
            success: function (res) {

                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                console.log(res.message);
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })


})