import { pool } from "../../config/db.js";
import type { ClickEventJob } from "../../queue/clickQueue.js";

export async function insertClickEvents(data :ClickEventJob) {

    await pool.query(
     `INSERT INTO click_events (link_id, referrer,user_agent,ip_hash)
     VALUES ($1,$2,$3,$4)`,
     [data.linkId,data.referrer,data.userAgent,data.ipHash]
    );
    
}