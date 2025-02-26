import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    user: 'just.ngcuong',
    password: 'JNC@123',
    host: 'localhost',
    port: 3306,
    database: 'souldb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
