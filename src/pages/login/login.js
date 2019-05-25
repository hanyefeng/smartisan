require(["../../static/conf/config.js"], function () {
	require(["jquery"], function ($) {
        require(["../../scripts/common/common"], function () {
            $("input").on("focus",function(){
                $(this).parent().css("opacity",1);
                $(this).parent().addClass("focus").removeClass("hover");
            }).on("blur",function(){
                $(this).parent().css("opacity",.618);
                $(this).parent().removeClass("focus").addClass("hover"); 
                
                //先判断输入框是否为空来处理label的显示
                //在进行手机号或邮箱格式匹配
                if($(this).val()===""){
                    $(this).parent().removeClass("invalid");
                    $(this).nextAll(".warning").hide();
                    $(this).prev().css("opacity",1);
                }else if($(this).attr("name")=="username"){
                    if(!/^1[35678]\d{9}$/.test($(this).val())&&!/^[\da-zA-Z][\w\.-]*[^\.-]@[0-9a-z]+(\.[0-9a-z]+)+$/g.test($(this).val())){
                        $(this).parent().addClass("invalid");
                        $("#u-format-error").show();
                        
                    }else{
                        $(this).parent().removeClass("invalid");
                        $(this).nextAll(".warning").hide();
                    } 
                } 
            }).on("input",function(){
                $(this).parent().removeClass("invalid");
                $(this).nextAll(".warning").hide();
                $(this).prev().css("opacity",0)
                if((!/^1[35678]\d{9}$/.test($(".username input").val())
                    &&!/^[\da-zA-Z][\w\.-]*[^\.-]@[0-9a-z]+(\.[0-9a-z]+)+$/g.test($(".username input").val()))
                    ||$(".username input").val()===""||$(".password input").val()===""){
                        $(".btn").addClass("disabled");
                }else{
                    $(".btn").removeClass("disabled");
                }
            })

            // 自动登录
            $(".checkbox").on("click",function(){
                if($(".checkbox").is(".checked")){
                    $(".checkbox").removeClass("checked");
                }else{
                    $(".checkbox").addClass("checked");
                }
            })

            //登录按钮 
            // 思路：
            // 1、先判断密码是否符合规则(大于等于6位)，如不符合则提示密码错误
            // 2、符合规范 则遍历localStorage中用户名是否有匹配的
            //     {
            //         1、 找到匹配项则检查密码是否正确{
            //             1、密码正确  登录成功{
            //                 自动登录：保存在cookie中增加时间戳
            //                 不自动登录：保存在sessionStorage中
            //             }
            //             2、密码不正确  提示密码不正确
            //         }
            //         2、没找到匹配项 ：提示用户名不存在
            //     }
            
            $(".btn").on("click",function(){
                if($(".btn").is(".disabled")) return;
                let userinfoStr=localStorage.getItem("userinfo");
                if($(".password input").val().length<6){
                    $("#p-error").show();
                    $(".password .input").addClass("invalid");
                    $(".btn").addClass("disabled");
                }else{
                    //userinfo是否存在 存在再判断是否有匹配项
                    if(!userinfoStr){
                        $(".username .input").addClass("invalid");
                        $("#u-not-exist").show();
                        $(".btn").addClass("disabled");
                    }else{
                        let userinfo=JSON.parse(userinfoStr);
                        let userExist=userinfo.some(function(t){
                            return t["username"]==$(".username input").val();
                        })
                        if(!userExist){
                            $(".username .input").addClass("invalid");
                            $("#u-not-exist").show();
                            $(".btn").addClass("disabled");
                        }else{
                            let passwordTrue=userinfo.some(function(t){
                                return t["username"]==$(".username input").val()&&t["password"]==$(".password input").val();
                            })
                            if(!passwordTrue){
                                $("#p-error").show();
                                $(".password .input").addClass("invalid");
                                $(".btn").addClass("disabled");
                            }else{
                                addCookie("userinfo",JSON.stringify({username:$(".username input").val(),password:$(".password input").val()}),10)
                                location.href="../home/home.html";
                            }
                        }
                    }
                }
            })
            //注册按钮切换
            $(".registercloud").on("click",()=>{
                location.href="../register/register.html";
            })
            
        })
    })
})
