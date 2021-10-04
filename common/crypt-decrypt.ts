// import {AES, config, encode} from "../deps.ts";

// const {IV, AES_NAME} = config();

import {AES} from "https://deno.land/x/god_crypto/aes.ts";

const aes = new AES("Hello World AES!", {
    mode: "cbc",
    iv: "random 16byte iv",
});
const cipher = await aes.encrypt("This is AES-128-CBC. It works.");
console.log(cipher.hex());
// 41393374609eaee39fbe57c96b43a9da0d547c290501be50f983ecaac6c5fd1c

const plain = await aes.decrypt(cipher);
console.log(plain.toString());
// This is AES-128-CBC. It works.

// const aes = new AES(`${AES_NAME}`, {
//     mode: "cbc",
//     iv: `${IV}`,
// });



// deno-lint-ignore no-explicit-any
// export const cryptData = async (data: any) => {
//     const cypher = await aes.encrypt(data);
//     return cypher
//     //return cypher.hex();
// };

// const cipher = await aes.encrypt("This is AES-128-CBC. It works.");
// console.log(cipher.hex());
// // 41393374609eaee39fbe57c96b43a9da0d547c290501be50f983ecaac6c5fd1c
//
// const plain = await aes.decrypt(cipher);
// console.log(plain.toString());
// // This is AES-128-CBC. It works.


// deno-lint-ignore no-explicit-any
// export const decryptData = async (cipher: any) => {
//     const data = await aes.decrypt(cipher);
//     return data.toString();
// };

// const myData = await cryptData('Ejele guon asda das dasdas das das dasas das asg as gasf gasfg asfg asf gasfg afg asfgsafg ');
// console.log(myData)
// const mydecript = await decryptData(myData);
// console.log(mydecript)
//console.log("🚀 ~ file: crypt-decrypt.ts ~ line 25 ~ mydecript", mydecript);

// let data = {
//   user: 'Daniel'
// }

// const abc = new AES('Hello World AES!', {
//   mode: "cbc",
//   iv: "random 16byte iv",
// });
// const cipher = await abc.encrypt(JSON.stringify(data));
// console.log(cipher.hex());
// // 41393374609eaee39fbe57c96b43a9da0d547c290501be50f983ecaac6c5fd1c
//
// const plain = await abc.decrypt(cipher);
// console.log(plain.toString());
// // This is AES-128-CBC. It works.
//
// console.log(IV)
