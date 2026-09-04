import type{ Request, Response } from "express";
import { config } from "../config/config.js";
import { deleteUser, loginUser, registerUser, updateUserPassword} from "../services/authService.js";
import type { AuthRequest } from "../middlewares/auth.js";
export async function registerHandler (req: Request, res: Response){
  try {
    const{email,password} = req.body;

 if (!email || !password) {
     return res.status(400).json({ error: 'Email and password required' })
  
  }

  if (password.length < 6) {
     return res.status(400).json({ error: 'Password must be at least 6 characters' })
  
   }
   const {user,token} = await registerUser({email,password});

    const isProduction = config.node_env === 'production';
    res.cookie('token',token,{
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction? 'strict':'lax',
    maxAge:7 * 24 * 60 * 60 * 1000
   });
   return res.status(201).json({user})
  } catch (error: any) {
    if (error?.code === '23505') {
      return res.status(409).json({
        error: 'Email or username already taken',
      });
    }

    return res.status(500).json({
      error: 'Server error',
    });
  }  

}

export async function loginHandler (req: Request, res: Response){
  try {
    const{email,password} = req.body;

 if (!email || !password) {
   return res.status(400).json({ error: 'Email and password required' })
    
  }

   const {user,token} = await loginUser({email,password});

    const isProduction = config.node_env === 'production';
    res.cookie('token',token,{
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction? 'strict':'lax',
    maxAge:7 * 24 * 60 * 60 * 1000
   });
   return res.status(200).json({user})
  } catch (error: any) {

    if(error?.message === 'INVALID_CREDENTIALS'){
      return res.status(401).json({
        error:'Invalid email or password',
      });
    }
    return res.status(500).json({
      error: 'Server error',
    });
  }  

}

export async function updatePasswordHandler (req: AuthRequest, res: Response){
  try {
    const{newPassword, currPassword} = req.body;
    const userId = req.userId;

    if ( !userId) {
    return res.status(401).json({ error: 'Unauthorized' })
   
  }

 if ( !newPassword || !currPassword) {
    res.status(400).json({ error: 'current  and new password required' })
    return
  }
    if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters' })
    return
  }
   
   const user = await updateUserPassword({id: userId,currPassword,newPassword});

   return res.status(200).json({user})
  } catch (error: any) {

    if(error?.message === 'INVALID_CREDENTIALS'){
      return res.status(401).json({
        error:'Invalid email or password',
      });
    }
    return res.status(500).json({
      error: 'Server error',
    });
  }  

}

export async function deleteUserHandler (req: AuthRequest, res: Response){
  try {
    const userId = req.userId;

    if ( !userId) {
   return res.status(401).json({ error: 'Unauthorized' })
    
  }

   
   const user = await deleteUser(userId);
    const isProduction = config.node_env === 'production';
   res.clearCookie('token',{
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction? 'strict': 'lax',
   });
   return res.status(200).json({user})
  } catch (error: any) {

    if(error?.message === 'USER_NOT_FOUND'){
      return res.status(404).json({
        error:'User not found',
      });
    }
    return res.status(500).json({
      error: 'Server error',
    });
  }  

}

