import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    user: 'just.ngcuong',
    password: 'JNC@123',
    // host: 'localhost',
    host: ' 14.238.29.226',
    port: 3306,
    database: 'souldb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
