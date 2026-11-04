// lib/zse.js —— 知乎 ZSE 签名（x-zse-96）
// 移植自 zhihu-cli (AGPL-3.0) scripts/lib/zse-signer.js
// 用途：复刻知乎官方客户端的请求签名算法，用于访问知乎自身的 API。
// 说明：这是使用官方同款签名，不是绕过风控；不修改任何校验逻辑。
'use strict';
const crypto = require('node:crypto');

const ZK = new Uint32Array([1170614578, 1024848638, 1413669199, 3951632832, 3528873006, 2921909214, 4151847688, 3997739139, 1933479194, 3323781115, 3888513386, 460404854, 3747539722, 2403641034, 2615871395, 2119585428, 2265697227, 2035090028, 2773447226, 4289380121, 4217216195, 2200601443, 3051914490, 1579901135, 1321810770, 456816404, 2903323407, 4065664991, 330002838, 3506006750, 363569021, 2347096187,]);
const ZB = new Uint8Array([20, 223, 245, 7, 248, 2, 194, 209, 87, 6, 227, 253, 240, 128, 222, 91, 237, 9, 125, 157, 230, 93, 252, 205, 90, 79, 144, 199, 159, 197, 186, 167, 39, 37, 156, 198, 38, 42, 43, 168, 217, 153, 15, 103, 80, 189, 71, 191, 97, 84, 247, 95, 36, 69, 14, 35, 12, 171, 28, 114, 178, 148, 86, 182, 32, 83, 158, 109, 22, 255, 94, 238, 151, 85, 77, 124, 254, 18, 4, 26, 123, 176, 232, 193, 131, 172, 143, 142, 150, 30, 10, 146, 162, 62, 224, 218, 196, 229, 1, 192, 213, 27, 110, 56, 231, 180, 138, 107, 242, 187, 54, 120, 19, 44, 117, 228, 215, 203, 53, 239, 251, 127, 81, 11, 133, 96, 204, 132, 41, 115, 73, 55, 249, 147, 102, 48, 122, 145, 106, 118, 74, 190, 29, 16, 174, 5, 177, 129, 63, 113, 99, 31, 161, 76, 246, 34, 211, 13, 60, 68, 207, 160, 65, 111, 82, 165, 67, 169, 225, 57, 112, 244, 155, 51, 236, 200, 233, 58, 61, 47, 100, 137, 185, 64, 17, 70, 234, 163, 219, 108, 170, 166, 59, 149, 52, 105, 24, 212, 78, 173, 45, 0, 116, 226, 119, 136, 206, 135, 175, 195, 25, 92, 121, 208, 126, 139, 3, 75, 141, 21, 130, 98, 241, 40, 154, 66, 184, 49, 181, 46, 243, 88, 101, 183, 8, 23, 72, 188, 104, 179, 210, 134, 250, 201, 164, 89, 216, 202, 220, 50, 221, 152, 140, 33, 235, 214,]);
const ALPHABET = '6fpLRqJO8M/c3jnYxFkUVC4ZIG12SiH=5v0mXDazWBTsuw7QetbKdoPyAl+hN9rgE';
const KEY16 = Buffer.from('059053f7d15e01d7', 'utf8');

function readU32Be(b,o){return ((b[o]&0xff)<<24)|((b[o+1]&0xff)<<16)|((b[o+2]&0xff)<<8)|(b[o+3]&0xff);}
function writeU32Be(v,out,o){out[o]=(v>>>24)&0xff;out[o+1]=(v>>>16)&0xff;out[o+2]=(v>>>8)&0xff;out[o+3]=v&0xff;}
function rotateLeft(v,b){return ((v<<b)|(v>>>(32-b)))>>>0;}
function transform(v){
  const m=((ZB[(v>>>24)&0xff]&0xff)<<24)|((ZB[(v>>>16)&0xff]&0xff)<<16)|((ZB[(v>>>8)&0xff]&0xff)<<8)|(ZB[v&0xff]&0xff);
  return (m ^ rotateLeft(m,2) ^ rotateLeft(m,10) ^ rotateLeft(m,18) ^ rotateLeft(m,24))>>>0;
}
function encryptBlock(input){
  const r=new Uint32Array(36);
  for(let i=0;i<4;i++) r[i]=readU32Be(input,i*4);
  for(let i=0;i<32;i++){const v=(r[i+1]^r[i+2]^r[i+3]^ZK[i])>>>0; r[i+4]=(r[i]^transform(v))>>>0;}
  const out=Buffer.alloc(16);
  writeU32Be(r[35],out,0);writeU32Be(r[34],out,4);writeU32Be(r[33],out,8);writeU32Be(r[32],out,12);
  return out;
}
function encryptBlocks(data,iv){
  let vec=Buffer.from(iv); const out=Buffer.alloc(data.length);
  for(let o=0;o<data.length;o+=16){
    const mixed=Buffer.alloc(16);
    for(let i=0;i<16;i++) mixed[i]=data[o+i]^vec[i];
    vec=encryptBlock(mixed); vec.copy(out,o);
  }
  return out;
}
function customEncode(input){
  let bytes=Buffer.from(input);
  const rem=bytes.length%3;
  if(rem!==0) bytes=Buffer.concat([bytes,Buffer.alloc(3-rem)]);
  let out='',mi=0;
  for(let o=bytes.length-1;o>=0;o-=3){
    let val=0;
    for(let i=0;i<3;i++){
      const mask=(58>>>(8*(mi%4)))&0xff;
      val|=((bytes[o-i]^mask)&0xff)<<(i*8);
      mi++;
    }
    out+=ALPHABET[val&63]+ALPHABET[(val>>>6)&63]+ALPHABET[(val>>>12)&63]+ALPHABET[(val>>>18)&63];
  }
  return out;
}
function encryptZseV4(input){
  const encoded=encodeURIComponent(input);
  const plain=[210,0,...Buffer.from(encoded,'ascii')];
  const pad=16-(plain.length%16); plain.push(...new Array(pad).fill(pad));
  const pb=Buffer.from(plain);
  const first=Buffer.alloc(16);
  for(let i=0;i<16;i++) first[i]=pb[i]^KEY16[i]^42;
  const fc=encryptBlock(first);
  const cipher=Buffer.alloc(pb.length); fc.copy(cipher,0);
  if(pb.length>16) encryptBlocks(pb.subarray(16),fc).copy(cipher,16);
  return customEncode(cipher);
}
function signRequest(url,dc0='',body=null,zse93='101_3_3.0'){
  const p=new URL(url);
  const pathname=p.pathname+p.search;
  const source=[zse93,pathname,dc0,body].filter(v=>v!==null).join('+');
  const md5=crypto.createHash('md5').update(source).digest('hex');
  return '2.0_'+encryptZseV4(md5);
}
module.exports={signRequest,encryptZseV4,ZK,ZB};
