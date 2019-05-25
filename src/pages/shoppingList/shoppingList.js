require(["../../static/conf/config.js"], function () {
	require(["jquery"], function ($) {
        require(["../../scripts/common/common"], function () {

          
            init();
            let response={};
            document.addEventListener(shoppingTable.REFRESH_SHOPPING_TABLE,refresh)
            
            function init(){
                //判断是否登录
                let islogin=null;
                if(!getCookie("userinfo")){
                    //未登录
                    $(".login-btn").show();
                }else{
                    //已登录
                    $(".login-btn").hide();
                    let username=JSON.parse(getCookie("userinfo"))["username"];
                    let showname=username.replace(/(.{3}).*(.{4})/, '$1******$2')

                    $(".nav-user-avatar dt").text("+86 "+showname)
                }

                //顶部头像触发事件
                $(".nav-user").on("mouseenter",function(){
                    if(!getCookie("userinfo"))return;
                    $(".nav-user-wrapper").show();
                }).on("mouseleave",function(){
                    $(".nav-user-wrapper").hide();
                }).on("click",function(){
                    if(!getCookie("userinfo")){
                        location.href="http://localhost:9999/pages/login/login.html";
                    }else{
                        location.href="http://localhost:9999/pages/home/home.html";
                    }
                })
                
                //顶部头像退出账号事件
                $(".logout").on("click",function(){
                    addCookie("userinfo","",-1);
                    location.href="http://localhost:9999/pages/home/home.html";
                })


                 $(".title").nextAll().remove();
                new EmptyList($(".gray-box"))
                if(getCookie("userinfo")){
                    //登录了
                    $(".login-btn").hide();
                }
                let shoppingList=JSON.parse(localStorage.getItem("shoppingList"));
                let length=0;
                let str="";
                for(let prop in shoppingList){
                    str+=prop+",";
                    length++;
                }
                str=str.substr(0,str.length-1);
                if(length>0){
                    $(".title").nextAll().remove();
                    $.ajax({
                        url: "http://localhost:8000/goodinfo?id="+str,
                        success: function (result) {
                            response = (JSON.parse(result))["data"]["list"];
                            new shoppingTable(response,shoppingList,$(".gray-box"));	
                        }
                    })
                }
            }
            
            function refresh(e){
                $(".title").nextAll().remove();
                new EmptyList($(".gray-box"))
                if(getCookie("userinfo")){
                    //登录了
                    $(".login-btn").hide();
                }
                let length=0;
                console.log(e.data);
                for(let prop in e.data){
                    length++;
                }
                if(length>0){
                    $(".title").nextAll().remove();
                    new shoppingTable(response,e.data,$(".gray-box"));	
                }
            }
        })
    })
})