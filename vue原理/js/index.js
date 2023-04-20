const user = {
    name: '刘帅',
    birth: '2002-5-7'
}
observe(user)   //观察

function showFirstName() {
    // const firstName = user.name.charAt(0)
    // return firstName;
    document.querySelector('#firstName').textContent = "姓:" + user.name[0]
}

function showLastName(){
    // const lastNameSplit = user.name.split(showFirstName())
    // const lastName = lastNameSplit[1]
    // return lastName
    document.querySelector('#lastName').textContent = "名:" + user.name.slice(1)
}

function showAge() {
    const birthday = new Date(user.birth)
    const time = new Date()
    const userMonth = birthday.getMonth()
    const timeMonth = time.getMonth()
    const userDate = birthday.getDate()
    const timeDate = time.getDate()
    const aboutAge =  time.getFullYear() - birthday.getFullYear()
    
    let age = 0
    if(timeMonth < userMonth) {
        age = aboutAge - 1
    }else if (timeMonth === userMonth){
        age =  timeDate > userDate ? aboutAge-1 : aboutAge
    }else{
        age =  aboutAge
    }
    document.querySelector('#age').textContent = "年龄:" + age
}

// let internalName = user.name
// Object.defineProperty(user, "name", {
//     get:function(){
//         return internalName
//     },
//     set: function(val){
//         internalName = val
//         console.log(`有个家伙再给name赋值,赋的值为${val}`);
//         //自动调用依赖该属性的函数
//         showFirstName()
//         showLastName()
//     }
// })

autorun(showFirstName)
autorun(showLastName)
autorun(showAge)


