// require(["../../static/conf/config.js"], function(){
// 	require(["jquery","sw","router"], function($, Swiper, ROUTER){
// 		console.log($); 

// 		$.ajax({
// 			url: ROUTER.CATEGORY
// 		})
// 	})
// })

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
			

			//副导航吸顶效果
			$(window).scroll(function(){
				let height= $(window).scrollTop();
				if(height>=100){
					$("#nav-sub").addClass("fixed");
					$("#nav-sub").css({
						// position:"fixed",
						// top:0,
						padding:"16px 0"
					});
					$("#nav-sub .search-bar").hide();
					$("#nav-sub .nav-info").show();
					$("#top .nav-info").hide();
				}else{
					$("#nav-sub").removeClass("fixed");
					$("#nav-sub").css({
						padding:"23px 0",
					});
					$("#nav-sub .search-bar").show();
					$("#nav-sub .nav-info").hide();
					$("#top .nav-info").show();
				}
			})


			
			// 热词搜索框 开始先获取热词
			let hotword=[];
			$.ajax({
				url: "http://localhost:8000/hotwords",
				success: function (data) {
					hotword = (JSON.parse(data))["hot"];
				}
			})

			function setHotWord(){
				$(".result-list").empty();
				for(let i=0;i<hotword.length;i++){
					let li=$("<li>");
					$("<span>").text(hotword[i]).appendTo(li);
					li.appendTo(".result-list");
				}
			}

			function searchEvent(){
				$(".result-list").empty();
				$.ajax({
					url: "http://localhost:8000/suggest?keyword="+$(".search-box").val(),
					success: function (data) {
						let response = (JSON.parse(data))["data"]
						if(response.length==0){
							$(".keywords-list").hide();
							$(".search-recommend-words").hide();
						}else{
							for(let i=0;i<response.length;i++){
								let li=$("<li>");
								let span=$("<span>").text(response[i]).appendTo(li);
								//处理搜索词变蓝
								var re =new RegExp("(" + $(".search-box").val() + ")","ig");
								span.html(span.html().replace(re,"<span style='color:#5079d9;font-weight:bold'>$1</span>"))
								li.appendTo(".result-list");
							}
							$(".keywords-list").show();
							$(".search-recommend-words").hide();
						}
					}
				})	
			}
			//输入框相关事件
			let CnKey=true;
			$(".search-box").on("focus", function () {
				if($(".search-box").val()==""){
					setHotWord();
				}else{
					searchEvent();
				}
				$(".keywords-list").show();
				$(".search-recommend-words").hide();
				$(this).attr("placeholder", "请输入搜索的商品");
			}).on("blur", function () {
				$(".keywords-list").hide();
				$(".search-recommend-words").show();
				$(this).attr("placeholder", "");
			}).on("input",throttle(function(){
				setTimeout(function(){
					if(CnKey) {
							if($(".search-box").val()==""){
								$(".keywords-list").show();
							$(".search-recommend-words").hide();
								setHotWord();
							}else{
								searchEvent();
							}
					}
				},1)
				
			},300)).on('compositionstart',function(){
				CnKey = false;
			}).on('compositionend',function(){
				CnKey = true;
			});


			//轮播图
			var mySwiper = new Swiper('.swiper-container', {
				pagination: {
					el: '.swiper-pagination',
					type: 'bullets',
					clickable :true
				},
				autoplay: true,
				speed:1500,
				effect : 'fade'
			})

			//热门商品左右控制
			$(".home-page-arrow").on("click",arrowClick);
			function arrowClick(e){
				if(this.className=="home-page-arrow disable"){
					return;
				}
				//console.log($(this));
				$(this).addClass("disable").siblings().removeClass("disable");
				if($(this).prevAll().length){
					$(".hot-items").css({
						transform:  "translate(-1220px, 0px)"
					})
				}else{
					$(".hot-items").css({
						transform:  "translate(0px, 0px)"
					})
				}
			}

			//home信息获取
			$.ajax({
				url: "http://localhost:8000/home",
				success: function (data) {
					let response = (JSON.parse(data));
					//热门
					let hotData=response["data"]["home_hot"];
					for(let i=0;i<hotData.length;i++){
						new GoodsItem(hotData[i],$(".hot-items")[0])
					}
					//品牌周边
					let brandData=response["data"]["home_floors"][0]["tabs"][0]["tab_items"];
					for(let i=1;i<brandData.length;i++){
						new GoodsItem(brandData[i],$(".brand-items")[0])
					}
					// 坚果手机与配件
					let phoneData=response["data"]["home_floors"][1]["tabs"][0]["tab_items"];
					for(let i=1;i<phoneData.length;i++){
						new GoodsItem(phoneData[i],$(".phone-items")[0])
					}
					//官方精选配件
					let officialData=response["data"]["home_floors"][2]["tabs"][0]["tab_items"];
					for(let i=1;i<phoneData.length;i++){
						new GoodsItem(officialData[i],$(".official-items")[0])
					}
					//论坛
					let bbsData=response["data"]["home_forum"];
					$(".image-text-wrapper").children().each(function(t){
						$(this).children("div").children("img").attr("src",bbsData[t]["image"]);
						$(this).children("div").children("h5").text(bbsData[t]["title"]);
						$(this).children("div").children("p").text(bbsData[t]["subtitle"]);
						$(this).children("div").children("a").attr("href",bbsData[t]["link"]);
					})
				}
			})
		})
	})
})