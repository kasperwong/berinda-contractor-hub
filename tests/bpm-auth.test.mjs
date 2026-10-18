import assert from 'node:assert/strict';
import test from 'node:test';
import { createBpmViewerSession, BPM_ACCESS_WINDOW_MS } from '../lib/auth/bpm-policy.ts';

const identity = { uid:'bpm-user-123', email:'Staff@Example.com', name:'Staff Member' };
function dependencies(profile = {status:'approved'}, overrides = {}) {
  const calls=[];
  return {calls, verifyToken:async()=>identity, readProfile:async()=>profile,
    mintToken:async(uid,claims)=>{calls.push({uid,claims});return 'custom-session-token';},now:()=>1000000,...overrides};
}

test('approved BPM account gets a separate viewer identity and bounded approval', async()=>{
  const deps=dependencies({status:'approved',role:'admin'});
  const result=await createBpmViewerSession('valid-bpm-token',deps);
  assert.equal(result.role,'viewer');
  assert.equal(result.approvedUntil,1000000+BPM_ACCESS_WINDOW_MS);
  assert.match(deps.calls[0].uid,/^bpm_[0-9a-f]{64}$/);
  assert.notEqual(deps.calls[0].uid,identity.uid);
  assert.equal(deps.calls[0].claims.bpmViewer,true);
  assert.equal(deps.calls[0].claims.bpmEmail,'staff@example.com');
  assert.equal(deps.calls[0].claims.admin,undefined);
  assert.equal(deps.calls[0].claims.role,undefined);
});

for(const profile of [null,{status:'pending'},{status:'rejected'},{status:'removed'},{status:'approved',active:false},{status:'approved',disabled:true}]) {
  test(`rejects unapproved/inactive profile ${JSON.stringify(profile)}`,async()=>{
    const deps=dependencies(profile);
    await assert.rejects(createBpmViewerSession('valid-bpm-token',deps),e=>e.status===403);
    assert.equal(deps.calls.length,0);
  });
}

test('invalid, revoked or wrong-project token never mints a Hub session',async()=>{
  const deps=dependencies(undefined,{verifyToken:async()=>{throw new Error('revoked');}});
  await assert.rejects(createBpmViewerSession('invalid',deps),e=>e.status===401);
  assert.equal(deps.calls.length,0);
});

test('missing token and oversized input are rejected before verification',async()=>{
  const deps=dependencies(undefined,{verifyToken:async()=>{throw new Error('must not run');}});
  for(const token of ['', 'x'.repeat(16385)]) await assert.rejects(createBpmViewerSession(token,deps),e=>e.status===401);
});

test('same BPM uid keeps its viewer identity after email change',async()=>{
  const first=dependencies();const second=dependencies(undefined,{verifyToken:async()=>({...identity,email:'new@example.com'})});
  await createBpmViewerSession('token',first);await createBpmViewerSession('token',second);
  assert.equal(first.calls[0].uid,second.calls[0].uid);
});

test('approval removal blocks renewal instead of extending old approval',async()=>{
  const deps=dependencies();await createBpmViewerSession('token',deps);
  deps.readProfile=async()=>({status:'removed'});
  await assert.rejects(createBpmViewerSession('token',deps),e=>e.status===403);
  assert.equal(deps.calls.length,1);
});

test('profile lookup failure cannot grant a session',async()=>{
  const deps=dependencies(undefined,{readProfile:async()=>{throw new Error('offline');}});
  await assert.rejects(createBpmViewerSession('token',deps));assert.equal(deps.calls.length,0);
});
