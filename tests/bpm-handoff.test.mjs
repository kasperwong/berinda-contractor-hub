import test from 'node:test';
import assert from 'node:assert/strict';
import { bpmHostWindow, trustedBpmMessage, validHandoffId } from '../lib/auth/bpm-handoff.ts';

const id = '9b84951d-d5de-47ba-9569-416f68431141';
test('embedded handoff uses its parent; standalone compatibility uses its opener', () => {
  const self={}, parent={}, opener={};
  assert.equal(bpmHostWindow(self,parent,opener),parent);
  assert.equal(bpmHostWindow(self,self,opener),opener);
  assert.equal(bpmHostWindow(self,self,null),null);
  assert.equal(trustedBpmMessage({origin:'https://localhost',source:parent,data:{requestId:id}},parent,id),true);
  assert.equal(trustedBpmMessage({origin:'https://localhost:1234',source:parent,data:{requestId:id}},parent,id),false);
});
test('handoff accepts only the registered opener, exact BPM origin and matching request', () => {
  const opener = {};
  const event = { origin: 'https://berinda-project-management.web.app', source: opener, data: { requestId: id } };
  assert.equal(trustedBpmMessage(event, opener, id), true);
  assert.equal(trustedBpmMessage({ ...event, source: {} }, opener, id), false);
  assert.equal(trustedBpmMessage({ ...event, origin: event.origin + '.attacker.test' }, opener, id), false);
  assert.equal(trustedBpmMessage({ ...event, data: { requestId: 'wrong' } }, opener, id), false);
  assert.equal(trustedBpmMessage(event, null, id), false);
  assert.equal(trustedBpmMessage({ ...event, data: null }, opener, id), false);
});
test('handoff identifiers cannot contain credentials, URLs or arbitrary strings', () => {
  assert.equal(validHandoffId(id), true);
  for (const value of ['', null, undefined, {}, 'https://example.com', 'eyJtoken', id + '?token=x']) assert.equal(validHandoffId(value), false);
});
