// 1 删除重复的值
const numbers = [3,12,54,12,4,4,3,12,16];
const filteredNumbers = numbers.filter((item,index) => numbers.indexOf(item) === index);
console.log(filteredNumbers); // [3, 12, 54, 4, 16]
// 2 删除无效值
const people = [
    { name: 'Amy', gender: 'female', age: '28' },
{ name: 'James', gender: 'male', age: 13 },
{ name: 'Victor', gender: 'male', age: null },
{ name: 'David', gender: 'male', age: 28 },
{ name: 'Simon', gender: 'male', age: undefined },
{ name: 'Anna', gender: 'female', age: 21 },
{ name: 'Jane', gender: 'female', age: NaN }
];
const filteredPeople = people.filter(person => person.age !== undefined && typeof person.age === 'number' && !isNaN(person.age));
console.log(filteredPeople);
/*[
    { name: 'James', gender: 'male', age: 13 },
    { name: 'David', gender: 'male', age: 28 },
    { name: 'Anna', gender: 'female', age: 21 }
]*/
//3 过滤数字数组
const number1 = [23,54,1,3,72,28];
const oddNumbers = number1.filter(item => item % 2 !== 0);
console.log(oddNumbers);
// 过滤偶数 [ 23, 1, 3 ]
const isPrime = number =>{
    if(number === 1) return false;
    if(number === 2) return true;
    for(let i = 2;i < number; i++) {
        if(number % i === 0) return false;
    }
    return true;
};
const number2 = [23,54,1,3,72,28];
const newNumbers = number2.filter(isPrime);
console.log(newNumbers); // 素数 [23,3]
//4 过滤对象数组
const people1 = [
    { name: 'Amy', gender: 'female', age: 28 },
{ name: 'James', gender: 'male', age: 13 },
{ name: 'Victor', gender: 'male', age: 17 },
{ name: 'David', gender: 'male', age: 28 },
{ name: 'Simon', gender: 'male', age: 33 }
];
const newPeople = people1.filter(person => person.age > 18);
console.log(newPeople);
/*[
    { name: 'Amy', gender: 'female', age: 28 },
    { name: 'David', gender: 'male', age: 28 },
    { name: 'Simon', gender: 'male', age: 33 }
]*/
const womanPeople = people1.filter(person => person.age > 18 && person.gender === 'female');
console.log(womanPeople);
// [{ name: ‘Amy’, gender: ‘female’, age: 28 }]
