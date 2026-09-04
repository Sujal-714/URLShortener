
import { pool } from "../../config/db.js";

export async function insertLink({code ,originalUrl,userId}:{code:string ,originalUrl:string,userId: string | null}){
const result = await pool.query(
    `INSERT INTO links (code,original_url,user_id) 
    VALUES ($1,$2,$3)
    RETURNING id,code,original_url,created_at`,
    [code,originalUrl,userId]
);
return result.rows[0];
}

export async function fetchLinks(userId: string){
    const result = await pool.query(
        `SELECT original_url,code,user_id,created_at FROM links WHERE user_id=$1`,
        [userId]
    );
    return result.rows;
}
export async function fetchLinksById(linkId: string){
    const result = await pool.query(
        `SELECT original_url,code,user_id,created_at FROM links WHERE id=$1`,
        [linkId]
    );
    return result.rows[0];
}
export async function fetchLinkByCode(code: string){
    const result = await pool.query(
        `SELECT id,original_url,code,user_id,created_at FROM links WHERE code=$1`,
        [code]
    );
    return result.rows[0];
}

export async function removeLink({linkId,userId}:{linkId: string,userId: string}){
    const result = await pool.query(
        `DELETE FROM links where id=$1 AND user_id=$2 RETURNING * `,
        [linkId,userId]
    );
    return result.rows[0];
}
