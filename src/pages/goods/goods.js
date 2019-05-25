require(["../../static/conf/config.js"], function () {
	require(["jquery", "sw",], function ($, Swiper) {
		require(["../../scripts/common/common"], function () {
            //判断是否登录
			let islogin=null;
			if(!getCookie("userinfo")){
				//未登录
			}else{
				//已登录
				let username=JSON.parse(getCookie("userinfo"))["username"];
				let showname=username.replace(/(.{3}).*(.{4})/, '$1******$2')

				$(".nav-user-avatar dt").text("+86 "+showname)
			}

            //判断购物车是否为空 并创建相关信息
			if(localStorage.getItem("shoppingList")=="{}"||!localStorage.getItem("shoppingList")){
				new EmptyShop($(".nav-cart-list>div"));
			}else{
				$("<span>").addClass("cart-tip").addClass("cart-num").appendTo(".nav-cart>a");
				//顶部购物车数据获取
				let shoppingList=JSON.parse(localStorage.getItem("shoppingList"));
                let str="";
                for(let prop in shoppingList){
                    str+=prop+",";
                }
				str=str.substr(0,str.length-1);
				$.ajax({
					url: "http://localhost:8000/goodinfo?id="+str,
					success: function (result) {
						let response = (JSON.parse(result))["data"]["list"];
						new fullShop(response,shoppingList,$(".nav-cart-list>div"));	
					}
				})
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
			
			//顶部购物车触发事件
			$(".nav-cart").on("mouseenter",function(){
				$(".nav-cart-wrapper").show();
			}).on("mouseleave",function(){
				$(".nav-cart-wrapper").hide();
			})

			$(".nav-cart>a").on("click",function(){
				location.href="http://localhost:9999/pages/shoppingList/shoppingList.html";
			})



            //商品ID
            let id=getNum(location.search);

            //品类ID
            let ids=id.substr(0,id.length-2);

            function getNum(str){
                return str.split("=")[1];
            }
            let response={};
            $.ajax({
				url: "http://localhost:8000/goods?ids="+ids,
				success: function (data) {
                    response = (JSON.parse(data))["data"]["list"][0];
                    document.title=response["name"];
                    $.ajax({
                        url: "http://localhost:8000/goodinfo?id="+id,
                        success: function (result) {
                            let res2 = (JSON.parse(result))["data"]["list"][0];
                            new GoodsInfo(response,res2,$(".item-wrapper"));	
                        }
                    })
				}
            })

            document.addEventListener(GoodsInfo.CHANGE_URL_EVENT,changeUrl);
            function changeUrl(e){
                var state = {title:'',url:window.location.href};
                history.pushState(state,'','goods.html?ids='+e.url);
                let id=getNum(location.search);
                $.ajax({
                    url: "http://localhost:8000/goodinfo?id="+id,
                    success: function (result) {
                        let res2 = (JSON.parse(result))["data"]["list"][0];
                        $(".item-wrapper").empty(); 
                        new GoodsInfo(response,res2,$(".item-wrapper"));	
                    }
                })
            }

            document.addEventListener(GoodsInfo.ADD_SHOPPINGLIST_EVENT,changeShoppingList);

            function changeShoppingList(e){
                let id=String(e.id);
                let num=Number(e.num);
                let shoppingListStr=localStorage.getItem("shoppingList");
                if(!shoppingListStr){
                    localStorage.setItem("shoppingList",JSON.stringify({
                        [id]:{
                            "id":id,
                            "num":num
                        }
                    }))       
                }else{
                    let shoppingList=JSON.parse(shoppingListStr);
                    if(!shoppingList[id]){
                        shoppingList[id]={
                                "id":id,
                                "num":num
                        }
                        localStorage.setItem("shoppingList",JSON.stringify(shoppingList));
                    }else{
                        if(shoppingList[id]["num"]+num>10){
                            $(".toast-tips").addClass("on").children("label").text("失败，超过数量限制");
                            setTimeout(()=>{
                                $(".toast-tips").removeClass("on");
                            },1000)
                            return;
                        }else{
                            shoppingList[id]["num"]+=num;
                            localStorage.setItem("shoppingList",JSON.stringify(shoppingList));
                        }
                    }
                }
                $(".toast-tips").addClass("on").children("label").text("已添至购物车");
                setTimeout(()=>{
                    $(".toast-tips").removeClass("on");
                },1000)

                $(".nav-cart-list>div").empty();
                $("<span>").addClass("cart-tip").addClass("cart-num").appendTo(".nav-cart>a");
				//顶部购物车数据获取
				let shoppingList=JSON.parse(localStorage.getItem("shoppingList"));
                let str="";
                for(let prop in shoppingList){
                    str+=prop+",";
                }
				str=str.substr(0,str.length-1);
				$.ajax({
					url: "http://localhost:8000/goodinfo?id="+str,
					success: function (result) {
						let response = (JSON.parse(result))["data"]["list"];
						new fullShop(response,shoppingList,$(".nav-cart-list>div"));	
					}
				})
            }



        })
    })
})