import { config } from "./config/config.js";
import { connectRedis } from "./config/redis.js";



async function start(){
try {
    await connectRedis();
    console.log('Redis connected');
    const {default: app} = await import("./app.js");

app.listen(config.port, ()=>{
    console.log(`Server running on port ${config.port}`);   
});}
catch (error) {
    console.error('Redis failed to connect at startup',error);
}
}
start();