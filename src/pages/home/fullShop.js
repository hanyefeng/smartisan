class fullShop{
    constructor(data,localData,parent){
        this.data=data;
        this.localData=localData;
        this.parent=parent;
        this.fullshop=this.createFullShop();
    }
    createFullShop(){
        let full=$("<div>").addClass("full").appendTo(this.parent);
        let items=$("<div>").addClass("nav-cart-items").attr("id","iscroll_wrapper").appendTo(full);
        let ul=$("<ul>");
        this.createShopList(ul);
        ul.appendTo(items);
        let total=$("<div>").addClass("nav-cart-total").appendTo(full);
        //总量
        let allNum=0;
        for(let prop in this.localData){
            allNum+=this.localData[prop]["num"]
        }
        let goodsNum=$("<p>");
        goodsNum.html("共 ");
        let numStrong=$("<strong>").text(allNum).appendTo(goodsNum);
        goodsNum.html(goodsNum.html()+" 件商品")
        goodsNum.appendTo(total);
        //总价
        let countMoney=0;
        for(let prop in this.localData){
            for(let k=0;k<this.data.length;k++){
                if(this.data[k]["id"]==prop){
                    countMoney+=this.localData[prop]["num"]*this.data[k]["price"];
                    break;
                }
            }
        }
        let goodsPrice=$("<h5>").text("合计：")
        $("<span>").addClass("price-icon").text("￥").appendTo(goodsPrice);
        $("<span>").addClass("price-num").text(num2money(countMoney)+".00").appendTo(goodsPrice);
        goodsPrice.appendTo(total);
        //to购物
        let buyh6=$("<h6>");
            let navBtn=$("<a>");
            navBtn.addClass("nav-cart-btn");
            navBtn.text("去购物车");
            navBtn.on("click",function(){
                location.href="../shoppingList/shoppingList.html"
            })
            navBtn.appendTo(buyh6);
        buyh6.appendTo(total);
        return  full;
    }
    createShopList(parent){
        for(let prop in this.localData){
            let index=null;
            for(let k=0;k<this.data.length;k++){
                if(this.data[k]["id"]==prop){
                    index=k;
                    break;
                }
            }
            let li=$("<li>").addClass("clear_fix");
                let cartItem=$("<div>");
                cartItem.addClass("cart-item").attr("id",this.data[index]["id"]);
                    let cartItemInner=$("<div>");
                    cartItemInner.addClass("cart-item-inner");
                        //图片
                        let thumb=$("<div>");
                        thumb.addClass("item-thumb");
                            let thumbImg=$("<img>");
                            thumbImg.attr("src",this.data[index]["shop_info"]["ali_image"]);
                            thumbImg.appendTo(thumb);
                        thumb.appendTo(cartItemInner);
                        //其他信息
                        let desc=$("<div>");
                        desc.addClass("item-desc");
                            let cartCell=$("<div>");
                            cartCell.addClass("cart-cell");
                                //标题
                                let titleH4=$("<h4>");
                                let title=$("<a>");
                                title.text(this.data[index]["shop_info"]["title"]);
                                title.on("click",function(){
                                    console.log(prop)
                                    window.open("../goods/goods.html?id="+prop);
                                }.bind(this))
                                title.appendTo(titleH4);
                                titleH4.appendTo(cartCell);
                                //款式
                                let attrs=$("<div>").addClass("attrs");
                                for(let temp in this.data[index]["attr_info"]){
                                    let span=$("<span>");
                                    span.text(this.data[index]["attr_info"][temp]["value"]);
                                    span.appendTo(attrs);
                                }
                                attrs.appendTo(cartCell);
                                //价格
                                let priceH6=$("<h6>");
                                    $("<span>").addClass("price-icon").text("￥").appendTo(priceH6);
                                    $("<span>").addClass("price-num").text(num2money(this.data[index]["price"])+".00").appendTo(priceH6);
                                    $("<span>").addClass("item-num").text("x "+this.localData[this.data[index]["id"]]["num"]).appendTo(priceH6);
                                priceH6.appendTo(cartCell);
                            cartCell.appendTo(desc);
                        desc.appendTo(cartItemInner);
                    cartItemInner.appendTo(cartItem);
                cartItem.appendTo(li);
            li.appendTo(parent);
        }
    }
}