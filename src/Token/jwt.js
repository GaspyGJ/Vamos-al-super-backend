import  jwt  from 'jsonwebtoken';
const {sign, verify} = jwt

const secret = "vamos-al-super"

export function createTokenEmailPassword(user){
  const payload ={
    user_id:user.id,
    user_email:user.email
  }
  return sign(payload, secret)
}
export function createToken(user){
  const payload ={
    user_id:user.id,
    user_email:user.email,
    user_proveedor: user.proveedor
  }
  return sign(payload, secret)
}
export function verifyToken(token){
  return verify(token, secret);
}



