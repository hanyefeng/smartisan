class EmptyShop{
    constructor(parent){
        this.parent=parent;
        this.createEmptyBox()
    }
    createEmptyBox(){
        let empty=$("<div>").addClass("empty").appendTo(this.parent);
        $("<h3>").text("购物车为空").appendTo(empty);
        $("<p>").text("您还没有选购任何商品，现在前往商城选购吧！").appendTo(empty);
    }
}