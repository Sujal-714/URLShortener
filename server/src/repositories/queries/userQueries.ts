import { pool } from "../../config/db.js";

export async function createUser({email,password_hash}:{email:string,password_hash:string}){
    const result = await pool.query(
    `INSERT INTO users (email,password_hash) 
    VALUES ($1,$2)
    RETURNING id,email,created_at`,
    [email,password_hash]
);
return result.rows[0];
}

export async function fetchUser(email: string){
    const result = await pool.query(
   `SELECT * FROM users WHERE email=$1`,
   [email]
);
return result.rows[0];
}
export async function fetchUserById(id: string){
    const result = await pool.query(
   `SELECT * FROM users WHERE id=$1`,
   [id]
);
return result.rows[0];
}

export async function updatePassword({id,password_hash}:{id:string,password_hash:string}){
    const result = await pool.query(
        `UPDATE users
        SET password_hash = $1
        WHERE id= $2
        RETURNING id,email,created_at`,
        [password_hash,id]
    );
    return result.rows[0];
}
export async function removeUser(id:string){
    const result = await pool.query(
        `DELETE FROM users
        WHERE id= $1
        RETURNING id,email,created_at`,
        [id]
    );
    return result.rows[0];
}