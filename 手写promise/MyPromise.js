const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    //私有属性
    #state = PENDING;
    #result = undefined;
    //记录then里的onFulfilled, onRejected，resolve, reject
    #handlers = [];

    constructor(executor) {
        const resolve = (data) => {
            this.#changeState(FULFILLED, data)
        };
        const reject = (reason) => {
            this.#changeState(REJECTED, reason)
        };
        //只能捕获同步错误
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error)
        }
    }

    #changeState(state, result) {
        if (this.#state !== PENDING) return
        this.#state = state
        this.#result = result
        this.#run()
        // console.log(this.#state, this.#result)

    }

    #isPromiseLike(value) {
        if(value !== null && (typeof value === 'object' || typeof value === 'function')){
            return typeof value.then === 'function'
        }
        return false
    }

    #runMicroTask(func){
        //node环境
        if(typeof process === 'object' && typeof process.nextTick === 'function') {
            process.nextTick(func)
        }
        //浏览器环境
        else if(typeof MutationObserver === 'function') {
            const ob  = new MutationObserver(func);
            const textNode = document.createTextNode('1');
            ob.observe(textNode, {
                characterData: true
            })
            textNode.data = '2'
        } else {
            setTimeout(func, 0)
        }
    }

    #runOne(callback, resolve, reject) {
        this.#runMicroTask(() => {
            if (typeof callback !== 'function') {
                const settled = this.#state === FULFILLED ? resolve : reject
                settled(this.#result)
                return;
            }
            try {  //回调不是函数 穿透 上面调用成功那么也是成功
                const data = callback(this.#result)
    
                if(this.#isPromiseLike(data)) { //判断回调是不是第一个promise
                    data.then(resolve,reject)
                }else{
                    resolve(data)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    #run() {
        if (this.#state === PENDING) return;
        while (this.#handlers.length) {
            const {
                onFulfilled,
                onRejected,
                reject,
                resolve
            } = this.#handlers.shift();
            if (this.#state === FULFILLED) {
                this.#runOne(onFulfilled, resolve, reject)
            } else {
                this.#runOne(onRejected, resolve, reject)
            }

        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this.#handlers.push({
                onFulfilled,
                onRejected,
                resolve,
                reject,
            })
            this.#run()
        });
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    finally(onFinally) {
        return this.then((data) => {
            onFinally()
            return data
        },err => {
            onFinally()
            throw err
        })
    }

    static resolve(value) {
        if(value instanceof MyPromise) return value
        let _resolve, _reject
        const p = new MyPromise((resolve, reject) =>{
            _resolve = resolve
            _reject = reject
        });
        if(p.#isPromiseLike(value)) {
            value.then(_resolve, _reject)
        }else{
            _resolve(value)
        }
        return p
    }

    static reject(reason) {
        return new MyPromise((resolve,reject) => {
            reject(reason)
        })
    }
}


// const p = new MyPromise((resolve, reject) => {
//     // resolve(1)
//     // reject(123)
//     // throw 123

//     //异步错误不会影响promise状态 因为捕获不到
//     // setTimeout(() =>{
//     //     throw 123
//     // })
//     setTimeout(() => {
//         resolve(123)
//     }, 1000)
// })

// p.then(null, err => {
//     console.log('promise 失败1', err);
//     p
// }).then((data) => {
//     console.log('ok', data);

// })


// const p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(1)
//     }, 1000);
// })

// p2.then((data) => {
//     console.log('ok1', data);
//     return new MyPromise((resolve, reject) =>{
//         setTimeout(() => {
//             resolve(data * 2)
//         }, 1000);
//     })
// }).then(data => {
//     console.log('ok2', data);
    
// })

// function delay(duration = 1000) {
//     return new MyPromise(resolve => {
//         setTimeout(resolve, duration);
//     })
// }
// async function test(){
//     await delay(1000)
//     console.log('ok1');
    
// }
// test()

//-------------------------------
// setTimeout(() => {
//     console.log(1);
    
// }, 0);
// //微队列
// new MyPromise(resolve => {
//     resolve(2)
// }).then(data => {
//     console.log(data);
// })

// console.log(3);
// ----------------------------
// new MyPromise((resolve, reject) =>{
//    resolve(123);
// }).finally(() => {
//     console.log('finally')
// })
//-----------------------------
const p3 = new MyPromise((resolve) => {
    resolve(1);
});

MyPromise.resolve(123123123).then((data) => {
    console.log(data);
    
})
MyPromise.reject(1233).catch((data) => {
    console.log(data);
    
})