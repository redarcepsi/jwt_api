import pg from 'pg';
const { Pool } = pg;

export default new Pool({
    user:'user',
    host:'db',
    database : 'myapp',
    password : 'password',
    port: 5432
})