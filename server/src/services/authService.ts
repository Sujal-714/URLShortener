
import bcrypt from 'bcryptjs';
import { createUser,fetchUser,  fetchUserById,  removeUser,  updatePassword } from '../repositories/queries/userQueries.js';
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';

export async function registerUser({email,password}:{email:string,password:string}){

   const password_hash = await bcrypt.hash(password, 10);

   const user = await createUser({email,password_hash});

   const token = jwt.sign(
    {userId: user.id},
    config.jwt_secret,
    {expiresIn: '7d'}
   )
 
   return {
    user,
    token,
   };
   
}

export async function loginUser({email,password}:{email:string,password:string}){
   const user = await fetchUser(email);

   if(!user){
     throw new Error('INVALID_CREDENTIALS');
   }
   
   const valid = await bcrypt.compare(password,user.password_hash);

     if(!valid){
     throw new Error('INVALID_CREDENTIALS');
   }

   const token = jwt.sign(
       {userId: user.id},
    config.jwt_secret,
    {expiresIn: '7d'}
   )

   const {password_hash, ...safeUser} = user;

   return{
      user: safeUser,
      token
   }

}
export async function updateUserPassword({id,currPassword,newPassword}:{id:string,currPassword:string,newPassword: string}){
   const user = await fetchUserById(id);
 
   if(!user){
      throw new Error('INVALID_CREDENTIALS');
   }

   const valid = await bcrypt.compare(currPassword,user.password_hash);

     if(!valid){
     throw new Error('INVALID_CREDENTIALS');
   }

   const password_hash = await bcrypt.hash(newPassword,10);

   const updatedUser = await updatePassword({id: user.id,password_hash});


   return updatedUser;


}
export async function deleteUser(id:string){
   const deletedUser = await removeUser(id);
 
   if(!deletedUser){
      throw new Error('USER_NOT_FOUND');
   }



   return deletedUser;


}