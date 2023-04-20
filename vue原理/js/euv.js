//数据响应式
function observe(obj) {
    for (const key in obj) {
        let internalValue = obj[key]
        // let funcs = new Set()
        let funcs = []
        Object.defineProperty(obj, key, {
            get: function(){
                //依赖收集， 记录：是哪个函数在用我
                // funcs.add(abc)
                if(window.__func && !funcs.includes(window.__func)){
                    funcs.push(window.__func)
                }
                return internalValue
            },
            set:function(val){
                internalValue = val;
                //派发更新，运行：执行用我的函数
                for (let i = 0; i < funcs.length; i++) {
                    funcs[i]()
                }
            }
        })
    }
}

function autorun(fn) {
    window.__func = fn;
    fn();
    window.__func = null;
}