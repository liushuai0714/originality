let aGoods = {
    pic: '.',
    title:'.',
    desc:'.',
    sellNumber:1,
    favorRate:2,
    price:3
}
 class UIGoods {

    //等同于下面的object.defineProperty方法
    get totalPrice(){
        return this.choose * this.data.price
    }

    get isChoose(){
        return this.choose > 0;
    }

    constructor(g) {
        g = {...g} //复制对象
        Object.freeze(g) //冻结原始数据
        // this.data = g;
        Object.defineProperty(this, 'data', {
            // value:g,
            // writable: false, //不可重写
            // enumerable:true,  //可遍历
            // configurable:false,//不可修改描述符本身
            get: function(){
                return g
            },
            set: function(){
                throw new Error(`data 属性是只读的，不能重新赋值`)
            },
            configurable: false,
        });
        let internalChooseValue = 0
        Object.defineProperty(this, 'choose', {
            configurable: false,
            get: function() {
                return internalChooseValue
            },
            set: function (val) {
                if(typeof val !== "number"){
                    throw new Error(`choose必须是数字`)
                }
                let temp = parseInt(val)
                if(temp !== val) {
                    throw new Error(`choose必须是整数`)
                }
                if(val < 0) {
                    throw new Error(`choose必须大于等于0`)
                }
                internalChooseValue = val;
            },
        })
        // Object.defineProperty(this, 'totalPrice', {
        //     get:function(){
        //         return this.choose * this.data.price
        //     },
        // })


        //其他属性
        this.a = 1;
        Object.seal(this)  //密封  原属性不能更改 其他属性可以更改
    }
 }

Object.freeze(UIGoods.prototype) //冻结原型

 let g = new UIGoods(aGoods);
// g.data = 'abc' //报错
//  console.log(g.data);
//  g.choose = -10//报错
// g.choose = 2
//  console.log(g.totalPrice);

//  g.data.price = 100;

//  g.a = 3
//  console.log(g);

UIGoods.prototype.haha = 'abc'
console.log(g.haha);



 
 
 
 