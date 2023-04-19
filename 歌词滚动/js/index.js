// 解析歌词
function parseLrc() {
    const lines = lrc.split('\n')
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        const str = lines[i];
        const parts = str.split(']')
        const timeStr = parts[0].substring(1)

        let obj = {
            time: parseTime(timeStr) - 1,
            words: parts[1],
        }
        result.push(obj)
    }
    return result
}
/**
 * 将时间字符串解析为数字（秒）
 * @param {*} timeStr 
 * @returns 
 */
function parseTime(timeStr) {
    const parts = timeStr.split(":");
    // console.log(parts);
    return +parts[0] * 60 + +parts[1]
}

const lrcData = parseLrc();

const doms = {
    audio: document.querySelector("audio"),
    ul:document.querySelector(".container ul"),
    container: document.querySelector('.container')
}
/**
 * 计算出播放器播放到第几秒应该高亮显示的歌词
 * 
 */
function findIndex(){
    const curTime = doms.audio.currentTime
    // console.log(curTime);
    // console.log(lrcData);
    for (let i = 0; i < lrcData.length; i++) {
        if(curTime < lrcData[i].time){
            return i - 1;
        }
    }
    //找遍了没找到（说明播放到最后一句）
    return lrcData.length - 1;
}

//界面
/**
 * 创建歌词元素li
 */
function createLrcElements(){
    const frag = document.createDocumentFragment() //文档片段
    for (let i = 0; i < lrcData.length; i++) {
        const li = document.createElement("li");
        li.textContent = lrcData[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag)
}

createLrcElements()
//得到ul的高度
const containerHeight = doms.container.clientHeight;
//得到li的高度
const liHeight = doms.ul.children[0].clientHeight;
//最大偏移量
const maxOffset = doms.ul.clientHeight - containerHeight
/**
 * 设置ul元素的偏移量
 */
function setOffset(){
    const index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2
    if(offset < 0) {
        offset = 0
    }
    if(offset > maxOffset) {
        offset = maxOffset
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
    //去掉之前的active样式
    const activeLi = doms.ul.querySelector('.active')
    if(activeLi){
        activeLi.classList.remove('active')
    }
    // doms.ul.children[index].className = 'active'
    const li = doms.ul.children[index];
    if(li){
        li.classList.add('active')
    }
}
doms.audio.addEventListener('timeupdate', setOffset)

setOffset();