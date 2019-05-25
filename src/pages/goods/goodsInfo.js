class GoodsInfo{
    constructor(data,data2,parent){
        this.data=data;
        this.data2=data2;
        this.parent=parent;
        this.goods=this.createGoodsInfo();
        this.fixBottom=this.createBottom();
        this.tips=this.createTips();
    }
    createGoodsInfo(){
        let section=$("<section>");
        section.addClass("gray-box").addClass("clear_fix");
        this.galleryWapper=this.createGalleryWapper();
        this.galleryWapper.addClass("gallery-wrapper");
        this.information=this.createInformation();
        this.information.addClass("item-information");
        this.galleryWapper.appendTo(section);
        this.information.appendTo(section);
        section.appendTo(this.parent);
        return section;
    }
    createGalleryWapper(){
        let div=$("<div>");
            let galleryDiv=$("<div>");
            galleryDiv.addClass("gallery");
            // thumbnail===左侧的几个小图
                let thumbnail=$("<figure>");
                thumbnail.addClass("thumbnail");
                    let ulL=$("<ul>")
                    for(let i=0;i<this.data2["shop_info"]["ali_images"].length;i++){
                        let li=$("<li>");
                        i==0?li.addClass("on"):"";
                        li.on("click",(e)=>{
                            $(e.currentTarget).addClass("on").siblings().removeClass("on");
                            this.bigImg.attr("src",$(e.currentTarget).children("img").attr("src"));
                        })
                        let smallImg=$("<img>");
                        smallImg.attr("src",this.data2["shop_info"]["ali_images"][i]);
                        smallImg.appendTo(li);
                        li.appendTo(ulL);
                    }
                    ulL.appendTo(thumbnail);
                thumbnail.appendTo(galleryDiv);
            //tumb 中间大图
                let tumb=$("<figure>");
                tumb.addClass("tumb");
                    let ulR=$("<ul>");
                        let li=$("<li>");
                        li.addClass("on");
                            this.bigImg=$("<img>");
                            this.bigImg.attr("src",this.data2["shop_info"]["ali_images"][0])
                            this.bigImg.appendTo(li);
                        li.appendTo(ulR);
                    ulR.appendTo(tumb);
                tumb.appendTo(galleryDiv);
            galleryDiv.appendTo(div);
        return div;
    }
    createInformation(){
        let div=$("<div>");
        this.titleWrap=this.createTitle();
        this.titleWrap.addClass("item-title");
        this.titleWrap.appendTo(div);
        this.createSection(div);
        this.number=this.createNumberDot();
        this.number.addClass("item-do-count-wrapper").addClass("clear_fix");
        this.number.appendTo(div);
        return div;
    }
    createTitle(){
        let title=$("<article>");
        this.title=$("<h1>");
        this.title.text(this.data["shop_info"]["spu_title"]);
        this.subtitle=$("<h2>");
        this.subtitle.text(this.data["shop_info"]["highlights"]);
        this.title.appendTo(title);
        this.subtitle.appendTo(title);
        let price=$("<div>");
        price.addClass("item-price");
            let span=$("<span>");
                let em=$("<em>");
                em.text("￥");
                em.appendTo(span);
                this.price=$("<i>");
                this.price.text(num2money(this.data2["price"])+".00");
                this.price.appendTo(span);
            span.appendTo(price);
        price.appendTo(title);
        return title;
    }
    createSection(parent){
        //遍历 通过["data"]["list"][0]["shop_info"]["spec_v2"]的spec_id来进行判断（switch）

        let goodsSection=this.data["shop_info"]["spec_v2"];
        let sectionLength=goodsSection.length;
        for(let s=0;s<sectionLength;s++){
            let section =$("<section>");
            section.addClass("item-spec-wrapper").addClass("clear_fix");
                let spec=$("<div>");
                spec.addClass("item-spec");
                    let title=$("<span>");
                    title.addClass("spec-title");
                    title.appendTo(spec);
                    let info=$("<ul>");
                    info.addClass("spec-info");
                    //根据数据加 
                    let styleArr=goodsSection[s]["spec_values"];
                    for(let t=0;t<styleArr.length;t++){
                        let li=$("<li>");
                        li.attr("typeId",styleArr[t]["spec_id"]).attr("ids",styleArr[t]["id"]);
                        li.on("click",this.changeStyleHandler.bind(this));
                        // t===0?li.addClass("active"):"";
                        let activeSet=this.data2["attr_info"];
                        if(activeSet[li.attr("typeId")]["spec_value_id"]==li.attr("ids")){
                            li.addClass("active").siblings().removeClass("active");
                        }

                        if(goodsSection[s]["spec_id"]==1){
                            let asideColor=$("<aside>");
                            let colorBox=$("<span>");
                            colorBox.addClass("color-box");
                            let i=$("<i>");
                            i.addClass("color-item");
                                let img=$("<img>");
                                img.attr("src",styleArr[t]["image"])
                                img.appendTo(i);
                            i.appendTo(colorBox);
                            colorBox.appendTo(asideColor);
                            asideColor.appendTo(li);
                        }
                        let aside=$("<aside>");
                        aside.addClass("specs-item").addClass("item-inline");
                        let h1=$("<h1>");
                        h1.addClass("item-name");
                        h1.text(styleArr[t]["show_name"])
                        h1.appendTo(aside);
                        aside.appendTo(li);
                        li.appendTo(info);
                    }
                    info.appendTo(spec)
                spec.appendTo(section);
            section.appendTo(parent);
            switch (Number(goodsSection[s]["spec_id"])){
                case 1:{
                    //颜色
                    section.addClass("item-spec-color");
                    title.text("颜色选择");
                    break;
                }
                case 2:{
                    //容量
                    section.addClass("item-spec-package");
                    title.text("容量选择");
                    break;
                }
                case 4:{
                    section.addClass("item-spec-package");
                    title.text("网络选择");
                }
                case 5:{
                    //容量
                    section.addClass("item-spec-package");
                    title.text("版本选择");
                    break;
                }
                case 8:{
                    //尺寸
                    section.addClass("item-spec-package");
                    title.text("尺寸选择");
                    break;
                }
                case 14:{
                    //款式
                    section.addClass("item-spec-package");
                    title.text("款式选择");
                    break;
                }
            }
        }
        
    }
    changeStyleHandler(e){
        $(e.currentTarget).addClass("active").siblings().removeClass("active");
        // console.log($(e.currentTarget).attr("typeId"),$(e.currentTarget).attr("ids"));
        $("li.active")
        let typeObj=[];
        $("li.active").each(function(t){
            typeObj.push({
                type:$(this).attr("typeId"),
                ids:$(this).attr("ids")
            })
        })
        // console.log(typeObj)
        let styleArr=this.data["sku_info"];
        for(let i=0;i<styleArr.length;i++){
            for(let k=0;k<styleArr[i]["spec_json"].length;k++){
                if(!(styleArr[i]["spec_json"][k]["spec_id"]==typeObj[k]["type"]&&styleArr[i]["spec_json"][k]["spec_value_id"]==typeObj[k]["ids"])){
                    break;
                }
                if(k==styleArr[i]["spec_json"].length-1){
                    let urlId=styleArr[i]["sku_id"];
                    let evt=new Event(GoodsInfo.CHANGE_URL_EVENT);
                    evt.url=urlId;
                    document.dispatchEvent(evt);
                }
            }

        }
    }
    createNumberDot(){
        let section=$("<section>");
            let div=$("<div>");
            div.addClass("item-do-count");
                let span=$("<span>");
                span.addClass("do-count-title");
                span.text("数量选择");
                span.appendTo(div);
                let aside=$("<aside>");
                aside.addClass("do-count");
                    let doCount=$("<do-count>");
                        let select=$("<div>");
                        select.addClass("select");
                            let down=$("<span>");
                            down.addClass("down").addClass("disabled");
                            down.on("click",this.bnClickHandler.bind(this));
                            down.appendTo(select);
                            this.num=$("<span>");
                            this.num.addClass("num");
                            this.num.text("1");
                            this.num.appendTo(select);
                            let up=$("<span>")
                            up.addClass("up");
                            up.on("click",this.bnClickHandler.bind(this));
                            up.appendTo(select);
                        select.appendTo(doCount);
                    doCount.appendTo(aside);
                aside.appendTo(div);
            div.appendTo(section);
        return section;
    }
    bnClickHandler(e){
        if($(e.currentTarget).is(".disabled")) return;
        if($(e.currentTarget).is(".down")){
            this.num.text(Number(this.num.text())-1);
            if(Number(this.num.text())<10){
                $(".up").removeClass("disabled")
                if(Number(this.num.text())<=1){
                    $(".down").addClass("disabled");
                }  
            }                    
        }else{
            this.num.text(Number(this.num.text())+1);
            if(Number(this.num.text())>1){
                $(".down").removeClass("disabled");
                if(Number(this.num.text())>=10){
                    $(".up").addClass("disabled");
                }
            }
        }
        this.bottomTitle.text(this.data["shop_info"]["spu_title"]+" x "+this.num.text());
        this.goodsCountPrice.text(num2money(Number(this.data2["price"])*Number(this.num.text()))+".00");
    }
    // 底部结算栏
    createBottom(){
        let fixbar=$("<div>");
        fixbar.addClass("product-fix-bar");
            let wrapper=$("<div>");
            wrapper.addClass("fix-bar-wrapper");

            let barText=$("<h1>");
            barText.addClass("bar-text");
            barText.text("您已选择了")
            barText.appendTo(wrapper);

            let infoDiv=$("<div>");
            infoDiv.addClass("bar-device-info");
                let titleWrap=$("<h1>");
                titleWrap.addClass("clear_fix");
                    this.bottomTitle=$("<span>");
                    this.bottomTitle.addClass("title");
                    this.bottomTitle.text(this.data["shop_info"]["spu_title"]+" × 1")
                    this.bottomTitle.appendTo(titleWrap);
                titleWrap.appendTo(infoDiv);
                this.bottomSubTitle=$("<h2>");
                let subtitle="";
                for(let prop in this.data2["attr_info"]){
                    subtitle+=this.data2["attr_info"][prop]["value"]+" | ";
                }
                subtitle=subtitle.substr(0,subtitle.length-3);
                this.bottomSubTitle.text(subtitle);
                this.bottomSubTitle.appendTo(infoDiv);
            infoDiv.appendTo(wrapper);

            let postageWrap=$("<div>");
            postageWrap.addClass("bar-postage-fee");
                let h1=$("<h1>");
                let postageTitle=$("<span>");
                postageTitle.addClass("title");
                postageTitle.text("运费");
                postageTitle.appendTo(h1);
                h1.appendTo(postageWrap);
                let price=$("<span>");
                price.addClass("price");
                    let i_postage=$("<i>");
                    i_postage.text("￥");
                    i_postage.appendTo(price);
                    this.postagePrice=$("<span>");
                    this.postagePrice.text(this.data["shop_info"]["postage_info"]["base_freight"]+".00");
                    this.postagePrice.appendTo(price);
                price.appendTo(postageWrap);
            postageWrap.appendTo(wrapper);

            let buyNow=$("<div>");
            buyNow.addClass("bar-btn");
                let buyNowA=$("<a>");
                buyNowA.text("现在购买");
                buyNowA.appendTo(buyNow);
            buyNow.appendTo(wrapper);

            let toShoppingList=$("<div>");
            toShoppingList.text("加入购物车");
            toShoppingList.addClass("bar-btn").addClass("add-cart-btn");
            toShoppingList.on("click",this.toShoppingList.bind(this));
            toShoppingList.appendTo(wrapper);

            let countPrice=$("<div>");
            countPrice.addClass("no-discount-price");
                let barPrice=$("<div>");
                barPrice.addClass("bar-price")
                    let i_price=$("<i>");
                    i_price.text("￥");
                    i_price.appendTo(barPrice);
                    this.goodsCountPrice=$("<span>");
                    this.goodsCountPrice.text(num2money(this.data2["price"])+".00");
                    this.goodsCountPrice.appendTo(barPrice);
                barPrice.appendTo(countPrice);
            countPrice.appendTo(wrapper);

            wrapper.appendTo(fixbar);
        fixbar.appendTo(this.parent);
        return fixbar;
    }

    createTips(){
        let div=$("<div>");
        div.addClass("toast-tips");
            let label=$("<label>");
            label.text("已添至购物车");
            label.appendTo(div);
            div.appendTo(this.parent);
        return div;
    }

    toShoppingList(){
        let evt=new Event(GoodsInfo.ADD_SHOPPINGLIST_EVENT);
        evt.id=this.data2["id"];
        evt.num=this.num.text();
        document.dispatchEvent(evt);
    }

    static get CHANGE_URL_EVENT(){
        return "change_url_event";
    }
    static get ADD_SHOPPINGLIST_EVENT(){
        return "add_shoppinglist_event";
    }
}