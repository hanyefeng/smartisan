class GoodsItem{
    constructor(data,parent){
        this.data=data;
        this.parent=parent;
        this.goods=this.createGoodsItem();
        this.render(this.data);
    }
    createGoodsItem(){
        let li=$("<li>");
        li.addClass("item-four");
        li.css({
            cursor:"pointer",
            position: "relative",
            float: "left",
            width: "25%",
            height: "429px"
        })
        let div=$("<div>");
        div.addClass("product-box-item");
        div.on("mouseenter",this.mouseenterInform.bind(this))
            .on("mouseleave",this.mouseleaveInform.bind(this));
        div.css({
            width: "100%",
            height: "100%",
            border: "none",
            borderRight: "1px solid #efefef",
            borderBottom: "1px solid #efefef",
            borderRadius: "initial"
        })
        let img_item=$("<div>");
        img_item.addClass("item-img");
        this.img=$("<img>");
        this.img.css({
            display: "block",
            width: "216px",
            height: "216px",
            margin: "0 auto",
            padding: "45px 0 20px"
        })
        this.img.attr("src",this.data["spu"]["sku_info"][0]["ali_image"]);
        this.img.appendTo(img_item);
        img_item.appendTo(div);
        this.title=$("<h4>");
        this.title.css({
            lineHeight: "1.2",
            fontSize: "14px",
            color: "#333333",
            fontWeight: 700,
            margin: "0 8px",
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        })
        this.title.appendTo(div);
        this.subtitle=$("<h6>");
        this.subtitle.css({
            overflow: "hidden",
            paddingTop: "15px",
            fontSize: "12px",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: "#999999",
            textAlign:"center"
        })
        this.subtitle.appendTo(div);
        this.colorDiv=this.createColorElem();
        this.colorDiv.appendTo(div);
        this.priceDiv=this.createPriceElem();
        this.priceDiv.appendTo(div);
        this.Inform=$("<div>");
        this.Inform.css({
            marginTop: "20px",
            display: "flex",
            justifyContent: "center"
        });
        let button=$("<button>");
        button.css({
            border: "1px solid #e1e1e1",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#646464",
            backgroundColor: "#f9f9f9",
            backgroundImage: "linear-gradient(#fff,#f9f9f9)",
            width: "100px",
            height: "30px",
            margin: "0 5px",
            textAlign: "center",
            cursor: "pointer",
            userSelect: "none",
            outline: "none",
            transition: "all .15s ease-out"
        })
        button.text("查看详情");
        button.appendTo(this.Inform);
        this.Inform.appendTo(div)
        this.Inform.hide();
        
        div.appendTo(li);
        li.appendTo(this.parent);
        li.on("click",()=>{
            window.open("../goods/goods.html?id="+this.data["sku_id"]);
        })
        return li;
    }
    mouseenterInform(){
        this.priceDiv.hide();
        this.Inform.show();
    }
    mouseleaveInform(){
        this.priceDiv.show();
        this.Inform.hide();
    }
    createColorElem(){
        let div=$("<div>");
        div.css({
            marginTop: "15px",
            textAlign: "center",
            height: "14px"
        })
        let ul=$("<ul>");
        ul.css({
            display: "inline-block",
            overflow: "hidden"
        })
        let typeArr=this.data["spu"]["shop_info"]["spec_v2"];
        let index=typeArr.findIndex(function(t){
            return t["spec_id"]==1;
        })
        let colorLength=index==-1?0:typeArr[index]["spec_values"].length;
        for(let i=0;i<colorLength;i++){
            let li=$("<li>");
            li.css({
                float: "left",
                cursor: "pointer",
                margin: "0 5px"
            });
            i==0?li.addClass("active"):"";
            li.attr("colorId",typeArr[index]["spec_values"][i]["id"]);
            li.attr("self",this);
            li.on("mouseenter",this.colorMouseover.bind(this));
            li.on("mouseleave",this.colorMouseout.bind(this));
            let colorOuter=$("<div>");
            colorOuter.addClass("out");
            colorOuter.css({
                width: "8px",
                height: "8px",
                border: "1px solid #e5e5e5",
                borderRadius: "50%",
                padding: "2px",
                transition: "all .15s ease-out"
            })
            colorOuter.appendTo(li);
            let colorImg=$("<img>");
            colorImg.css({
                width: "inherit",
                height: "inherit",
                borderRadius: "50%",
                display: "block"
            })
            colorImg.attr("src",typeArr[index]["spec_values"][i]["image"])
            colorImg.appendTo(colorOuter);
            colorOuter.appendTo(li);
            li.appendTo(ul);
        }
        ul.appendTo(div);   
        return div;
    }

    colorMouseover(e){
        $(e.currentTarget).siblings().removeClass("active");
        $(e.currentTarget).addClass("active");
        let imgArr=this.data["spu"]["sku_info"];
        let index=imgArr.findIndex(function(t){
            return t["color_id"]==$(e.currentTarget).attr("colorId");
        })
        let imgSrc=imgArr[index]["ali_image"];
        this.img.attr("src",imgSrc);
    }

    colorMouseout(){
        // $(this).siblings().removeClass("active");
        // $(this).removeClass("active");
    }

    createPriceElem(){
        let div=$("<div>");
        div.addClass("item-price").addClass("clear_fix");
        div.css({
            fontSize: 0,
            fontFamily: "Arial",
            color: "#d44d44",
            fontWeight: 700,
            marginTop: "20px",
            textAlign: "center",
            transition: "all 0.1s ease-out"
        });
        let span=$("<span>");
        span.css({
            fontSize: "18px",
            paddingLeft: "4px"
        });
        let $icon=$("<i>");
        $icon.text("￥");
        this.price=$("<span>");
        $icon.appendTo(span);
        this.price.appendTo(span);
        span.appendTo(div);
        return div;
    }
    render(data){
        this.title.text(data["spu"]["shop_info"]["spu_title"]);
        this.subtitle.text(data["spu"]["shop_info"]["spu_sub_title"]);
        this.price.text(data["spu"]["price"]+".00")
    }
}