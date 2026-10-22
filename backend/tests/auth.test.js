import test from 'node:test';
import assert from 'node:assert/strict';
process.env.DATABASE_URL ||= 'postgresql://u:p@localhost:5432/test';
process.env.JWT_ACCESS_SECRET ||= 'test-secret-with-more-than-32-characters';
const { hashPassword, checkPassword, issueToken, verifyToken } = await import('../src/auth.js');
test('passwords are hashed and only the original password verifies', async () => {
  const hash = await hashPassword('long-correct-password');
  assert.notEqual(hash, 'long-correct-password');
  assert.equal(await checkPassword('long-correct-password', hash), true);
  assert.equal(await checkPassword('wrong-password', hash), false);
});
test('JWT middleware accepts a signed token and rejects absent or malformed tokens', () => {
  const token = issueToken({id:'user-1',role:'USER'});
  const response=()=>({statusCode:200,body:null,status(code){this.statusCode=code;return this},json(body){this.body=body;return this}});
  let nextCalled=false;const req={get:()=>`Bearer ${token}`};verifyToken(req,response(),()=>{nextCalled=true});
  assert.equal(nextCalled,true);assert.equal(req.user.id,'user-1');
  for(const authorization of [undefined,'Basic abc','Bearer invalid']){const res=response();verifyToken({get:()=>authorization},res,()=>assert.fail('invalid token passed'));assert.equal(res.statusCode,401)}
});
