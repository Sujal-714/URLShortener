import { pool } from "../../config/db.js";


export interface LinkStats{
    totalClicks: number;
    clickLast7days: number;
    clickLast30days: number;
    topreferrers: {referrer: string, count: number}[];
    clicksByDay: {day: string, count: number}[];
}

export async function fetchLinkStats(linkId: string) {
    
    const [totals, byDay, referrers] = await Promise.all([
       pool.query(
        `SELECT
          COUNT(*) FILTER (WHERE true) AS total,
          COUNT(*) FILTER (WHERE clicked_at > NOW() - INTERVAL '7 days') AS last_7,
          COUNT(*) FILTER (WHERE clicked_at > NOW() - INTERVAL '30 days') AS last_30
          FROM click_events WHERE link_id = $1`,
          [linkId]
       ), 
       pool.query(
        `SELECT TO_CHAR(clicked_at,'YYYY-MM-DD')  AS day, COUNT(*) AS count
         FROM click_events 
         WHERE link_id = $1 AND clicked_at > NOW() - INTERVAL '30 days'
         GROUP BY TO_CHAR(clicked_at,'YYYY-MM-DD') 
         ORDER BY day ASC
         `,
          [linkId]
       ), 
       pool.query(
        `SELECT COALESCE(referrer, 'direct') AS referrer, COUNT(*) AS count
         FROM click_events 
         WHERE link_id = $1 
         GROUP BY referrer 
         ORDER BY count DESC
         LIMIT 5
         `,
          [linkId]
       ), 
    ]);

    return{
    totalClicks: Number(totals.rows[0].total),
    clickLast7days: Number(totals.rows[0].last_7),
    clickLast30days:  Number(totals.rows[0].last_30),
    topreferrers: referrers.rows.map(r => ({referrer: r.referrer, count: Number(r.count)})),
    clicksByDay: byDay.rows.map(r => ({day: r.day, count: Number(r.count)})),
    }
}