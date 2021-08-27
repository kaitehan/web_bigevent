$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义时间格式化过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }

    initTable()
    initCate()


    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                // console.log(res);
                layer.msg(res.message)
                // 使用模板引擎导入数据
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)

                // 调用渲染分页的方法
                renderPage(res.total)

            }
        });
    }



    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 调用模板引擎渲染分类可选项
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                // 通过layui 重新渲染表单区域的UI结构
                form.render()

            }
        });
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取筛选表单中选中的值
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        // 根据最新的筛选条件重新渲染表格中的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示多少数据
            curr: q.pagenum, //设置默认选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换时，触发JUMP回调
            // 触发jump回调方式有两种：
            // 1.点击页码的时候
            // 2.只要调用了laypage.render()方法，就会触发
            jump: function (obj, first) {

                // 可以通过first的值来判断，是通过哪种方式，触发的jump回调
                // 如果first的值为true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);

                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;

                // 把最新的条目数，赋值到q这个查询参数对象中
                q.pagesize = obj.limit;

                // 根据最新的q获取对应的数据列表，并渲染表格
                // 当通过方式1触发时调用initTable函数
                if (!first) {
                    initTable()
                }

            }

        });

    }

    // 通过代理的方式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function (e) {

        // 获取删除按钮的个数
        var length = $('.btn-delete').length

        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否确认删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.close(index);
                    layer.msg(res.message)
                    // 当数据删除后，需要判断当前页是否还有数据
                    // 如果当前页没有数据后，就让当前页面-1
                    // 再重新调用 initTable
                    if (length === 1) {
                        q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()



                }
            });


        });
    })

})