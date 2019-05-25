class EmptyList{
    constructor(parent){
        this.parent=parent;
        this.emptyList=this.createList();
    }
    createList(){
        let div=$("<div>");
        div.addClass("box-inner");
            let emptyBox=$("<div>");
            emptyBox.addClass("empty-label");
                let h3=$("<h3>");
                h3.text("您的购物车中还没有商品");
                h3.appendTo(emptyBox);
                let login=$("<a>");
                login.addClass("login-btn");
                login.text("登录");
                login.on("click",()=>{
                    location.href="http://localhost:9999/pages/login/login.html";
                })
                login.appendTo(emptyBox);
                let buyNow=$("<a>");
                buyNow.addClass("link-btn");
                buyNow.on("click",()=>{
                    location.href="http://localhost:9999/pages/home/home.html";
                })
                buyNow.text("现在购买");
                buyNow.appendTo(emptyBox);
            emptyBox.appendTo(div);
        div.appendTo(this.parent);
        return div;
    }
}