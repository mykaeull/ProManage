import { Pool } from "mysql2/promise";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

interface UserDatabaseSchema {
    name: string;
    email: string;
    role: string;
    id: number;
}

export class User {
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public role: string,
        public id?: number
    ) {}

    static async save(pool: Pool, user: User): Promise<number> {
        const [existingUser] = await pool.query(
            `SELECT id FROM users WHERE name = ?`,
            [user.username]
        );

        if ((existingUser as any[]).length > 0) {
            throw new Error("Username already exists");
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [user.username, user.email, hashedPassword, user.role]
        );
        return (result as mysql.ResultSetHeader).insertId;
    }

    static async findByUsername(
        pool: Pool,
        username: string
    ): Promise<User | null> {
        const [rows] = await pool.query<any[]>(
            `SELECT * FROM users WHERE name = ?`,
            [username]
        );
        if (rows.length === 0) return null;
        const user = rows[0] as any;
        return new User(
            user.name,
            user.password,
            user.email,
            user.role,
            user.id
        );
    }

    static async findAll(
        pool: Pool
    ): Promise<{ data: UserDatabaseSchema[]; totalData: number }> {
        const [rows] = await pool.query<any[]>(`SELECT * FROM users`);

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM users
        `
        );

        const totalData = countRows[0]?.total || 0;

        const users = rows.map((row) => {
            return {
                name: row.name,
                email: row.email,
                role: row.role,
                id: row.id,
            };
        });

        return {
            data: users,
            totalData: totalData,
        };
    }

    static async findAllFiltered(
        pool: Pool,
        page: number,
        pageSize: number
    ): Promise<{ data: UserDatabaseSchema[]; totalData: number }> {
        const offset = page * pageSize;

        const [rows]: [any[], any] = await pool.query(
            `
        SELECT id, name, email, role
        FROM users
        LIMIT ? OFFSET ?
        `,
            [pageSize, offset]
        );

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM users
        `
        );

        const totalData = countRows[0]?.total || 0;

        const users = rows.map((row) => {
            return {
                name: row.name,
                email: row.email,
                role: row.role,
                id: row.id,
            };
        });

        return {
            data: users,
            totalData: totalData,
        };
    }
}
