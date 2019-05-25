class shoppingTable{
    constructor(data,localData,parent){
        this.data=data;
        this.localData=localData;        
        this.parent=parent;
        this.boxInner=this.createShopBox();
        this.bottomFix=this.createBottomFix();
    }
    createShopBox(){
        let div=$("<div>");
        div.addClass("box-inner");
            let wrap=$("<div>");
                let tableTitle=$("<div>");
                tableTitle.addClass("cart-table-title");
                    let titleArr=["商品信息","操作","小计","数量","单价"];
                    let classArr=["name","operation","subtotal","num","price"];
                    for(let i=0;i<titleArr.length;i++){
                        let span=$("<span>");
                        span.text(titleArr[i]);
                        span.addClass(classArr[i]);
                        span.appendTo(tableTitle);
                    }
                tableTitle.appendTo(wrap);
                let tableContent=$("<div>");
                tableContent.addClass("cart-table");
                    let itemList=$("<div>");
                    itemList.addClass("item-list")
                        let cartGroup=$("<div>");
                        cartGroup.addClass("cart-group");
                            // for(let i=0;i<this.data.length;i++){

                            // }
                            this.createShopList(cartGroup);
                        cartGroup.appendTo(itemList);
                    itemList.appendTo(tableContent);
                tableContent.appendTo(wrap);
            wrap.appendTo(div);
        div.appendTo(this.parent);
        return div;
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
            let divide=$("<div>");
            divide.addClass("divide")
                let items=$("<div>");
                items.addClass("cart-items");
                    let item=$("<div>");
                    item.addClass("cart-item");
                    // 选择按钮
                        let checkboxWrap=$("<div>");
                        checkboxWrap.addClass("checkbox-container");
                            let checkBox=$("<span>");
                            checkBox.addClass("m-blue-checkbox-new").addClass("checkbox-on");
                            checkBox.attr("goodsId",prop);
                            checkBox.on("click",this.checkHandler.bind(this));
                            checkBox.appendTo(checkboxWrap);
                        checkboxWrap.appendTo(item);
                    //其他信息
                        let itemWrapper=$("<div>");
                        itemWrapper.addClass("item-wrapper");
                            //商品图片
                            let thumb=$("<div>");
                            thumb.addClass("items-thumb");
                                let img=$("<img>");
                                img.attr("src",this.data[index]["shop_info"]["ali_image"])
                                img.appendTo(thumb);
                            thumb.appendTo(itemWrapper);
                            //商品信息
                            let name=$("<div>");
                            name.addClass("name").addClass("hide-row");
                                let nameTable=$("<div>");
                                nameTable.addClass("name-table");
                                //标题
                                    let title=$("<a>");
                                    title.text(this.data[index]["shop_info"]["title"]);
                                    title.appendTo(nameTable);
                                //属性
                                    let attribute=$("<ul>");
                                    attribute.addClass("attribute").addClass("clear_fix");
                                        // 循环
                                        for(let temp in this.data[index]["attr_info"]){
                                            let li=$("<li>");
                                            li.text(this.data[index]["attr_info"][temp]["value"]);
                                            li.appendTo(attribute);
                                        }
                                    attribute.appendTo(nameTable);
                                nameTable.appendTo(name);
                            name.appendTo(itemWrapper);
                            //操作（删除）
                            let del=$("<div>");
                            del.addClass("operation");
                                let delBtn=$("<a>");
                                delBtn.addClass("items-delete-btn");
                                delBtn.attr("goodsId",prop);
                                delBtn.on("click",this.delBtnHanlder.bind(this));
                                delBtn.appendTo(del);                            
                            del.appendTo(itemWrapper);
                            //其他{总计、数量、单价}
                            let others=$("<div>");
                                //总计
                                let subtotal=$("<div>");
                                subtotal.addClass("subtotal");
                                    let subtotalI=$("<i>");
                                    subtotalI.text("￥");
                                    subtotalI.appendTo(subtotal);
                                    let subtotalSpan=$("<span>");
                                    subtotalSpan.text(num2money(this.data[index]["price"]*this.localData[this.data[index]["id"]]["num"])+".00");
                                    subtotalSpan.appendTo(subtotal);
                                subtotal.appendTo(others);
                                //数量
                                let itemNum=$("<div>");
                                itemNum.addClass("item-cols-num");
                                    let quantity=$("<div>");
                                    quantity.addClass("quantity");
                                    quantity.attr("goodsId",prop);
                                        //根据数量设置
                                        let goodsNum=this.localData[this.data[index]["id"]]["num"];
                                        let downBtn=$("<span>");
                                        downBtn.text("-");
                                        downBtn.addClass("button").addClass("down");
                                        goodsNum<=1?downBtn.addClass("disabled"):"";
                                        downBtn.on("click",this.numChangeBtn.bind(this));
                                        downBtn.appendTo(quantity);
                                        let num=$("<span>");
                                        num.addClass("num");
                                        num.text(goodsNum);
                                        num.appendTo(quantity);
                                        let upBtn=$("<span>");
                                        upBtn.text("+");
                                        upBtn.addClass("button").addClass("up");
                                        goodsNum>=10?upBtn.addClass("disabled"):"";
                                        upBtn.on("click",this.numChangeBtn.bind(this));
                                        upBtn.appendTo(quantity);
                                    quantity.appendTo(itemNum);
                                itemNum.appendTo(others);
                                //单价
                                let price=$("<div>");
                                price.addClass("price");
                                    let priceI=$("<i>");
                                    priceI.text("￥");
                                    priceI.appendTo(price);
                                    let priceSpan=$("<span>");
                                    priceSpan.text(num2money(this.data[index]["price"])+".00");
                                    priceSpan.appendTo(price);
                                price.appendTo(others);
                            others.appendTo(itemWrapper);
                    itemWrapper.appendTo(item);
                    item.appendTo(items);
                items.appendTo(divide);
            divide.appendTo(parent);
        }
    }
    createBottomFix(){
        let cartBottomWrap=$("<div>");
        cartBottomWrap.addClass("cart-bottom-bg").addClass("fix-bottom");
        cartBottomWrap.attr("id","cart_bottom");
            let fixInner=$("<div>");
            fixInner.addClass("fix-bottom-inner");
            //左边全选和删除选择部分
                let bottomOperation=$("<div>");
                bottomOperation.addClass("cart-bar-operation");
                    let allChoose=$("<div>");
                    allChoose.addClass("choose-all");
                        this.allChooseBtn=$("<span>");
                        this.allChooseBtn.addClass("m-blue-checkbox-new").addClass("checkbox-on");
                        this.allChooseBtn.on("click",this.checkHandler.bind(this))
                        this.allChooseBtn.appendTo(allChoose);
                        let allChooseLabel=$("<span>");
                        allChooseLabel.addClass("text-choose-all");
                        allChooseLabel.text("全选");
                        allChooseLabel.appendTo(allChoose);
                    allChoose.appendTo(bottomOperation);
                    let delChooseGoods=$("<div>");
                    delChooseGoods.addClass("delete-choose-goods");
                    //删除选择事件
                    delChooseGoods.on("click",this.delChooseGoodsEvent.bind(this));
                    delChooseGoods.text("删除选中的商品");
                    delChooseGoods.appendTo(bottomOperation);
                bottomOperation.appendTo(fixInner);
            //右边结算部分
                let shipping=$("<div>");
                shipping.addClass("shipping");
                    let shippingBox=$("<div>");
                    shippingBox.addClass("shipping-box");
                        let shippingNum=$("<div>");
                        shippingNum.addClass("shipping-total").addClass("shipping-num");
                            //刷新表格后的渲染默认全选
                            let allNum=0;
                            for(let prop in this.localData){
                                allNum+=this.localData[prop]["num"]
                            }
                            //已选择的商品数量
                            let numh4=$("<h4>");
                            numh4.addClass("highlight");
                            // numh4.html("已选择 ");
                            $("<b>已选择 </b>").appendTo(numh4);
                            this.selectGoodsNum=$("<i>");
                            this.selectGoodsNum.text(allNum);
                            this.selectGoodsNum.appendTo(numh4);
                            $("<b> 件商品</b>").appendTo(numh4);
                            // numh4.html(numh4.html()+" 件商品");
                            numh4.appendTo(shippingNum);
                            //所有商品的数量
                            let numh5=$("<h5>");
                            numh5.html("共计 ");
                            this.allGoodsNum=$("<i>");
                            this.allGoodsNum.text(allNum);
                            this.allGoodsNum.appendTo(numh5);
                            numh5.html(numh5.html()+" 件商品");
                            numh5.appendTo(shippingNum);
                        shippingNum.appendTo(shippingBox);
                        let shippingPrice=$("<div>");
                        shippingPrice.addClass("shipping-total").addClass("shipping-price");
                            //计算总金额
                            let countMoney=0;
                            for(let prop in this.localData){
                                for(let k=0;k<this.data.length;k++){
                                    if(this.data[k]["id"]==prop){
                                        countMoney+=this.localData[prop]["num"]*this.data[k]["price"];
                                        break;
                                    }
                                }
                            }
                            let priceh4=$("<h4>");
                            priceh4.addClass("highlight");
                            priceh4.text(" 应付金额：");
                                $("<span>").text("￥").appendTo(priceh4);
                                let priceh4I=$("<i>").appendTo(priceh4);
                                this.priceAll=$("<span>").appendTo(priceh4I);
                                this.priceAll.text(num2money(countMoney)+".00");
                            priceh4.appendTo(shippingPrice);
                            let priceh5=$("<h5>");
                            priceh5.addClass("shipping-tips");
                            priceh5.text("应付总额不含运费");
                            priceh5.appendTo(shippingPrice);
                        shippingPrice.appendTo(shippingBox);
                    shippingBox.appendTo(shipping);
                    let submitBtn=$("<span>");
                    submitBtn.addClass("jianguo-blue-main-btn").addClass("big-main-btn");
                        let buy=$("<a>");
                        buy.text("现在购买");

                        buy.appendTo(submitBtn);
                    submitBtn.appendTo(shipping);
                shipping.appendTo(fixInner);
            fixInner.appendTo(cartBottomWrap);
        cartBottomWrap.appendTo(this.parent);
        return cartBottomWrap;
    }
    //选择事件
    checkHandler(e){
        if($(e.currentTarget).is(".checkbox-on")){
            $(e.currentTarget).removeClass("checkbox-on");
        }else{
            $(e.currentTarget).addClass("checkbox-on");
        }
        if(!$(e.currentTarget).attr("goodsId")){
            if($(e.currentTarget).is(".checkbox-on")){
                $(".m-blue-checkbox-new").addClass("checkbox-on");
            }else{
                $(".m-blue-checkbox-new").removeClass("checkbox-on");
            }    
        }else{
            let count=0;
            $(".m-blue-checkbox-new").each(function(){
                if($(this).attr("goodsId")&&$(this).is(".checkbox-on")){
                    count++;
                }
            })
            if(count==$(".m-blue-checkbox-new").length-1){
                this.allChooseBtn.addClass("checkbox-on");
            }else{
                this.allChooseBtn.removeClass("checkbox-on");
            }
        }
        this.bottomChange();
    }
    //选择控制底部变化
    bottomChange(){
        let numAll=0;
        let moneyAll=0;
        let self=this;
        $(".m-blue-checkbox-new").each(function(){
            if($(this).attr("goodsId")&&$(this).is(".checkbox-on")){
                numAll+=self.localData[$(this).attr("goodsId")]["num"];
                console.log(numAll);
                for(let i=0;i<self.data.length;i++){
                    if(self.data[i]["id"]==$(this).attr("goodsId")){
                        moneyAll+=self.localData[$(this).attr("goodsId")]["num"]*self.data[i]["price"];
                    }
                }
            }
        })
        this.selectGoodsNum.text(numAll);
        this.priceAll.text(num2money(moneyAll)+".00");
    }
    //删除事件
    delBtnHanlder(e){
        delete this.localData[$(e.currentTarget).attr("goodsId")];
        this.refreshEvent();
    }
    //删除选中的商品
    delChooseGoodsEvent(){
        let self=this;
        $(".m-blue-checkbox-new").each(function(){
            if($(this).attr("goodsId")&&$(this).is(".checkbox-on")){
                delete self.localData[$(this).attr("goodsId")];
            }
        })
        this.refreshEvent();
    }
    //改变数量
    numChangeBtn(e){
        if($(e.currentTarget).is(".disabled"))return;

        let goodsId=$(e.currentTarget).parent().attr("goodsId");
        if($(e.currentTarget).is(".down")){
            this.localData[goodsId]["num"]--;
        }else{
            this.localData[goodsId]["num"]++;
        }
        this.refreshEvent();
    }
    //抛发事件 刷新表格
    refreshEvent(){
        localStorage.setItem("shoppingList",JSON.stringify(this.localData));
        let evt=new Event(shoppingTable.REFRESH_SHOPPING_TABLE);
        evt.data=this.localData;
        console.log(evt.data)
        document.dispatchEvent(evt);
    }
    static get REFRESH_SHOPPING_TABLE(){
        return "refresh_shopping_table";
    }
}