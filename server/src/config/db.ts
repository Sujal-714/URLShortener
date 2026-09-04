import { Pool } from "pg";
import { config } from "./config.js";

export const pool = new Pool({
    connectionString: config.database_url,
});

pool.on('error',(err) =>{
      // fires for idle clients that hit an unexpected error (e.g. connection dropped)
       console.error('Unexpected error on idle Postgres client', err);
      process.exit(1);
})