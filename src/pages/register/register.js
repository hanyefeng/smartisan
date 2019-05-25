require(["../../static/conf/config.js"], function () {
	require(["jquery"], function ($) {
        $("input").on("focus",function(){
            $(this).parent().css("opacity",1);
            $(this).parent().addClass("focus").removeClass("hover");
            if($(this).is("[type=password]")){
                $(this).parent().next().show();
            }
        }).on("blur",function(){
            $(this).parent().css("opacity",.618);
            $(this).parent().removeClass("focus").addClass("hover"); 
            
            $(".tips").hide();

            if($(this).val()===""){
                $(".btn-wrapper .btn").addClass("disabled");
                $(this).parent().removeClass("invalid");
                $(this).nextAll(".warning").hide();
                $(this).prev().css("opacity",1);
                if($("#password").val()!==$("#repassword").val()){
                    $("#repassword").parent().addClass("invalid");
                    $("#rp-not-same").show();
                }else{
                    $("#repassword").parent().removeClass("invalid");
                    $("#rp-not-same").hide();
                }
            }else if($(this).attr("name")=="mobile"){
                //先验证格式 再验证是否存在
                if(!/^1[35678]\d{9}$/.test($(this).val())){
                    $(this).parent().addClass("invalid");
                    $(".btn-wrapper .btn").addClass("disabled");
                    $("#m-format-error").show();
                }else{
                    //验证是否存在该用户
                    let userinfoStr=localStorage.getItem("userinfo");
                    if(userinfoStr){
                        let userinfo=JSON.parse(userinfoStr);
                        let sameInfo=userinfo.some(t => {
                            return t["username"]==$(".username input").val()
                        });
                        if(sameInfo){
                            $(this).parent().addClass("invalid");
                            $(".btn-wrapper .btn").addClass("disabled");
                            $("#m-registered").show();
                        }
                    }
                }
            }else if($(this).attr("name")=="password"){
                // 验证密码格式 密码长度 6~16 位，数字、字母和符号至少包含两种
                //即 不是纯数字 纯字母 或纯字符
                if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/.test($(this).val())){
                    $(this).parent().addClass("invalid");
                    $(".btn-wrapper .btn").addClass("disabled");
                    $("#p-format-error").show();
                }else{
                    $(this).parent().removeClass("invalid");
                    $("#p-format-error").hide();
                }
            }else if($(this).attr("name")=="repassword"){
                if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/.test($(this).val())){
                    $(this).parent().addClass("invalid");
                    $(".btn-wrapper .btn").addClass("disabled");
                    $("#rp-format-error").show();
                }else{
                    $("#rp-format-error").hide();
                    if($("#password").val()!==$("#repassword").val()){
                        $(this).parent().addClass("invalid");
                        $(".btn-wrapper .btn").addClass("disabled");
                        $("#rp-not-same").show();
                    }else{
                        $("#rp-not-same").hide();
                        $(this).parent().removeClass("invalid");
                    }                   
                }

            }

            //不论是否为空只要密码和重复密码不同就报错
            // if($("#password").val()!==$("#repassword").val()){
            //     $("#repassword").parent().addClass("invalid");
            //     $("#rp-not-same").show();
            // }else{
            //     $("#repassword").parent().removeClass("invalid");
            //     $("#rp-not-same").hide();
            // }           
        }).on("input",function(){
            $(this).parent().removeClass("invalid");
            $(this).nextAll(".warning").hide();
            $(this).prev().css("opacity",0)
            let isEmpty=true;
            for(let i=0;i<$("input").length;i++){
                if($("input").eq(i).val()==""){
                    isEmpty=false;
                }
            }
            if(isEmpty&&!$(".input").hasClass("invalid")){
                
                $(".btn-wrapper .btn").removeClass("disabled");
            }else{
                $(".btn-wrapper .btn").addClass("disabled");
            }
        })

        // input表单部分结束！！！----------

        //阅读协议
        $(".checkbox").on("click",function(){
            if($(".checkbox").is(".checked")){
                $(".checkbox").removeClass("checked");
            }else{
                $(".checkbox").addClass("checked");
            }
        })

        //注册按钮
        $(".btn-wrapper .btn").on("click",function(){
            // if(!($("input").val()!==""&&$(".input").has(".invalid").length==0))return;
            if($(".btn-wrapper .btn").is(".disabled")) return;
            let userinfoStr=localStorage.getItem("userinfo");
            if(!userinfoStr){
                localStorage.setItem("userinfo",
                    JSON.stringify([{
                        username:$(".username input").val(),
                        password:$(".password input").val()
                    }])
                )       
            }else{
                let userinfo=JSON.parse(userinfoStr);
                let sameInfo=userinfo.some(t => {
                    return t["username"]==$(".username input").val()
                });
                if(sameInfo){
                    $(".username .input").addClass("invalid");
                    $(".btn-wrapper .btn").addClass("disabled");
                    $("#m-registered").show();
                }else{
                    userinfo.push({
                        username:$(".username input").val(),
                        password:$(".password input").val()
                    })
                    localStorage.setItem("userinfo",JSON.stringify(userinfo));
                    alert("注册成功");
                    location.href="../login/login.html";
                }
            }
        })
        //登录页面按钮
        $(".tologin span").click(()=>{
            location.href="../login/login.html";
        })
    })
})