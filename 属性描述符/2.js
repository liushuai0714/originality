let obj = {}

Object.defineProperty(obj, 'a', {
    get: function(){
        console.log('hello world');
        
        return 123
    },   //读取器 getter
    set: function(val){
        throw new Error(`兄弟，你正在给a这个a的这个属性重新赋值，你所赋的值是${val},但是，这个属性是 不能赋值的`)
        
    },   //设置器 setter
});
console.log(obj.a);

obj.a = 'abc'
