import assert from 'node:assert/strict';
import test, {after, before} from 'node:test';
import {initializeApp,deleteApp} from 'firebase/app';
import {getFirestore,connectFirestoreEmulator,doc,getDoc,getDocs,collection,query,where,setDoc,updateDoc,deleteDoc,terminate} from 'firebase/firestore';

const projectId='demo-hub-bpm';
const host=process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^127\.0\.0\.1:\d+$/.test(host)) throw new Error('Run through the local Firestore emulator; production is never used.');
const [hostname,port]=host.split(':');
const clients=[];
const viewerUid=`bpm_${'a'.repeat(64)}`;
const expiredUid=`bpm_${'b'.repeat(64)}`;
const metadata={contractorId:'sample',name:'sample.pdf',storagePath:'firestore-chunks/sample/file',size:3,chunkCount:1};
const baseClaims={bpmViewer:true,bpmApprovedUntil:Date.now()+900000,bpmEmail:'admin@example.com'};

function context(uid,claims={}) {
  const app=initializeApp({projectId,apiKey:'emulator-only'},`test-${clients.length}`);
  const db=getFirestore(app);
  connectFirestoreEmulator(db,hostname,Number(port),uid?{mockUserToken:{sub:uid,...claims}}:{});
  clients.push({app,db});return db;
}
async function seed(path,fields) {
  const response=await fetch(`http://${host}/v1/projects/${projectId}/databases/(default)/documents/${path}`,{
    method:'PATCH',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify({fields})});
  assert.equal(response.ok,true,await response.text());
}
const s=(stringValue)=>({stringValue});
const b=(booleanValue)=>({booleanValue});
async function denied(action) {await assert.rejects(action,e=>e.code==='permission-denied');}

before(async()=>{
  await seed('appState/berinda-group',{groupId:s('berinda-group')});
  await seed('appState/berinda-group/projectBatches/sample',{groupId:s('berinda-group')});
  await seed('appState/berinda-group/contractorDocuments/file',{contractorId:s('sample'),name:s('sample.pdf')});
  await seed('appState/berinda-group/contractorDocuments/file/chunks/0000',{data:s('SGk=')});
  for(const [uid,role] of [['hub-admin','admin'],['hub-editor','editor'],['hub-viewer','viewer'],[viewerUid,'admin'],[expiredUid,'admin']]) {
    await seed(`users/${uid}`,{role:s(role),active:b(true),groupId:s('berinda-group'),email:s('admin@example.com')});
  }
});
after(async()=>{for(const {db,app} of clients){await terminate(db);await deleteApp(app);}});

test('BPM viewer can read directory, projects, document metadata and file chunks',async()=>{
  const db=context(viewerUid,baseClaims);
  for(const path of ['appState/berinda-group','appState/berinda-group/projectBatches/sample','appState/berinda-group/contractorDocuments/file','appState/berinda-group/contractorDocuments/file/chunks/0000']) {
    assert.equal((await getDoc(doc(db,path))).exists(),true);
  }
  assert.equal((await getDocs(query(collection(db,'appState/berinda-group/contractorDocuments'),where('contractorId','==','sample')))).size,1);
});

test('BPM viewer cannot write even if a Hub profile with its uid has admin role',async()=>{
  const db=context(viewerUid,baseClaims);
  await denied(()=>setDoc(doc(db,'appState/berinda-group'),{groupId:'berinda-group'}));
  await denied(()=>setDoc(doc(db,'appState/berinda-group/projectBatches/new'),{projects:[]}));
  await denied(()=>setDoc(doc(db,'appState/berinda-group/contractorDocuments/new'),metadata));
  await denied(()=>updateDoc(doc(db,'appState/berinda-group/contractorDocuments/file'),{name:'renamed.pdf'}));
  await denied(()=>deleteDoc(doc(db,'appState/berinda-group/contractorDocuments/file')));
  await denied(()=>setDoc(doc(db,'appState/berinda-group/contractorDocuments/file/chunks/0001'),{index:1,data:'SGk='}));
  await denied(()=>deleteDoc(doc(db,'appState/berinda-group/contractorDocuments/file/chunks/0000')));
});

test('expired approval cannot fall back to an active Hub admin profile',async()=>{
  const db=context(expiredUid,{...baseClaims,bpmApprovedUntil:Date.now()-1000});
  await denied(()=>getDoc(doc(db,'appState/berinda-group')));
});

test('reserved BPM identity without approval claims cannot use a normal Hub profile',async()=>{
  const db=context(viewerUid);
  await denied(()=>getDoc(doc(db,'appState/berinda-group')));
  await denied(()=>setDoc(doc(db,'appState/berinda-group'),{groupId:'berinda-group'}));
});

for(const uid of ['hub-admin','hub-editor']) {
  test(`existing ${uid} retains management access`,async()=>{
    const db=context(uid);
    assert.equal((await getDoc(doc(db,'appState/berinda-group'))).exists(),true);
    await setDoc(doc(db,'appState/berinda-group'),{groupId:'berinda-group',checkedBy:uid},{merge:true});
    await setDoc(doc(db,`appState/berinda-group/contractorDocuments/${uid}`),metadata);
  });
}

test('ordinary Hub viewer remains read-only and anonymous access remains denied',async()=>{
  const viewer=context('hub-viewer');
  assert.equal((await getDoc(doc(viewer,'appState/berinda-group'))).exists(),true);
  await denied(()=>setDoc(doc(viewer,'appState/berinda-group'),{groupId:'berinda-group'}));
  const anonymous=context(null);
  await denied(()=>getDoc(doc(anonymous,'appState/berinda-group/contractorDocuments/file')));
});
