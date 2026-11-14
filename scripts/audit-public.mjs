import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const skip=new Set(['.git','node_modules','.artifacts']);
const signatures=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /\bgh[pousr]_[A-Za-z0-9]{30,}\b/, /\bnpm_[A-Za-z0-9]{30,}\b/, /\bAKIA[0-9A-Z]{16}\b/, /\bsk-[A-Za-z0-9_-]{24,}\b/, /[A-Z]:[\\/]Users[\\/]/i];
const failures=[]; let count=0;
async function scan(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(skip.has(entry.name))continue;
  const file=path.join(dir,entry.name), rel=path.relative(root,file);
  if(entry.isDirectory())await scan(file);
  else if(entry.isFile()){
   count++;
   if(/^\.env(?:\.|$)|^\.npmrc$|credentials|\.pem$/i.test(entry.name))failures.push(rel);
   const text=await readFile(file,'utf8'); if(signatures.some(re=>re.test(text)))failures.push(rel);
  }
 }
}
await scan(root);
if(failures.length){console.error(JSON.stringify({status:'failed',files:[...new Set(failures)]}));process.exitCode=1;}
else console.log(JSON.stringify({status:'passed',filesReviewed:count,note:'Common credential signatures and personal Windows paths; not a guarantee against every possible secret.'}));
