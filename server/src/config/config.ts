import dotenv from 'dotenv';
dotenv.config();

const required = (key: string) : string => {
    const value = process.env[key]
    if(!value) throw new Error(`Configuration Error`);
    return value;
}

export const config = {
   database_url: required('DATABASE_URL'),
   port: Number(process.env.PORT) || 3000,
   jwt_secret: required('JWT_SECRET'),
   node_env: required('NODE_ENV'),
   redis_url: required('REDIS_URL')
}