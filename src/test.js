'use strict';
var arr = [2, 3, 4, 5];

function sleep() {
    return new Promise((resolve) => {
 return setTimeout(resolve, 1000);
});
}

console.log('=========forEach===========');
arr.forEach(async (item) => {
    await sleep();
    // console.log(item);
});

async function forLoop() {
    for (var item of arr) {
        await sleep();
        console.log(item);
    }
    console.log('=========for loop===========');
}
forLoop();
