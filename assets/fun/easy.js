//1. 声名变量
let x; let y = 20; let a, b = 20;
//2 给多个变量赋值
let aa,bb,cc;
aa = 1; bb = 2; cc = 3;
let [aa,bb,cc] = [1,2,3];
//3 三元运算符
let result = aa > 2 ? '1' : '3';
//4 默认值
let imagePath;
function getImagePath(){}
let path = getImagePath();
if(path !== null && path !== undefined && path !== '') {
    imagePath = path;
} else {
    imagePath = 'default.jpg';
}
//Shorthand
let imagePath = getImagePath() || 'default.jpg';

//5 与
//Longhand
// if (isLoggedin) {
//     goToHomepage();
// }
// //Shorthand
// isLoggedin && goToHomepage();
//6 交换两个变量
let x = 'h', y = '33';
[x, y]= [y,x];
//7 箭头函数
const add = (num1, num2) => num1 + num2;
//8 模板字符串
console.log(`You got a missed call from ${number} at ${time}`);

//9 多行字符串
//10 多条件检查
//Longhand
if (value === 1 || value === 'one' || value === 2 || value === 'two') {
    // Execute some code
}
// Shorthand 1
if ([1, 'one', 2, 'two'].indexOf(value) >= 0) {
    // Execute some code
}
// Shorthand 2
if ([1, 'one', 2, 'two'].includes(value)) {
    // Execute some code
}
// 11 对象属性复制
let obj = {firstname: firstname, lastname: lastname};
//Shorthand
let obj = {firstname, lastname};
//12 字符串转数字
//Longhand
let total = parseInt('453');
let average = parseFloat('42.6');
//Shorthand
let total = +'453';
let average = +'42.6';
//13 重复一个字符串多次
let str = '';
for(let i = 0; i < 5; i ++) {
    str += 'Hello ';
}
console.log(str); // Hello Hello Hello Hello Hello
// Shorthand
'Hello '.repeat(5);
//14 指数幂
// /Longhand
const power = Math.pow(4, 3); // 64
// Shorthand
const power = 4**3; // 64
//15 双非位运算符~~
// /Longhand
const floor = Math.floor(6.8); // 6
// Shorthand
const floor = ~~6.8; // 6
//16 找出数组中的最大和最小数字
// Shorthand
const arr = [2, 8, 15, 4];
Math.max(...arr); // 15
Math.min(...arr); // 2
//17 for循环

let arr = [10, 20, 30, 40];
//Longhand
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
//Shorthand
//for of loop
for (const val of arr) {
    console.log(val);
}
//for in loop
for (const index in arr) {
    console.log(arr[index]);
}
let obj = {x: 20, y: 50};
for (const key in obj) {
    console.log(obj[key]);
}
//18 合并数组
let arr1 = [20, 30];
//Longhand
let arr2 = arr1.concat([60, 80]);
// [20, 30, 60, 80]
//Shorthand
let arr2 = [...arr1, 60, 80];
// [20, 30, 60, 80]
//19 深拷贝 多级对象
// 为了深拷贝一个多级对象，我们要遍历每一个属性并检查当前属性是否包含一个对象。如果当前属性包含一个对象，然后要将当前属性值作为参数递归调用相同的方法（例如，嵌套的对象）。
// 我们可以使用JSON.stringify()和JSON.parse()，如果我们的对象不包含函数、undefined、NaN 或日期值的话。
// 如果有一个单级对象，例如没有嵌套的对象，那么我们也可以使用扩展符来实现深拷贝。
let obj = {x: 20, y: {z: 30}};
//Longhand
const makeDeepClone = (obj) => {
    let newObject = {};
    Object.keys(obj).map(key => {
        if(typeof obj[key] === 'object'){
            newObject[key] = makeDeepClone(obj[key]);
        } else {
            newObject[key] = obj[key];
        }
    });
    return newObject;
}
const cloneObj = makeDeepClone(obj);
//Shorthand
const cloneObj = JSON.parse(JSON.stringify(obj));
//Shorthand for single level object
let obj = {x: 20, y: 'hello'};
const cloneObj = {...obj};
// 来自评论的改进：如果你的对象包含 function, undefined or NaN 值的话，
// JSON.parse(JSON.stringify(obj)) 就不会有效。
// 因为当你 JSON.stringify 对象的时候，包含 function, undefined or NaN 值的属性
// 会从对象中移除。因此，当你的对象只包含字符串和数字值时，
// 可以使用JSON.parse(JSON.stringify(obj))。
//20 获取字符串中的字符
let str = 'jscurious.com';
//Longhand
str.charAt(2); // c
//Shorthand
str[2]; // c