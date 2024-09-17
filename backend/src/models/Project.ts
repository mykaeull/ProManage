import { Pool } from "mysql2/promise";
import mysql from "mysql2/promise";

export class Project {
    constructor(
        public name: string,
        public description: string,
        public initial_date: string,
        public final_date: string | null,
        public status: string,
        public id?: number
    ) {}

    static async save(pool: Pool, project: Project): Promise<number> {
        const [result] = await pool.query(
            `INSERT INTO projects (name, description, initial_date, final_date, status) VALUES (?, ?, ?, ?, ?)`,
            [
                project.name,
                project.description,
                project.initial_date,
                project.final_date,
                project.status,
            ]
        );
        return (result as mysql.ResultSetHeader).insertId;
    }

    static async findAll(
        pool: Pool
    ): Promise<{ data: Project[]; totalData: number }> {
        const [rows] = await pool.query<any[]>(`SELECT * FROM projects`);

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM projects
        `
        );

        const totalData = countRows[0]?.total || 0;

        const projects = rows.map(
            (row) =>
                new Project(
                    row.name,
                    row.description,
                    row.initial_date,
                    row.final_date,
                    row.status,
                    row.id
                )
        );

        return {
            data: projects,
            totalData: totalData,
        };
    }

    static async findAllFiltered(
        pool: Pool,
        page: number,
        pageSize: number
    ): Promise<{ data: Project[]; totalData: number }> {
        const offset = page * pageSize;

        const [rows]: [any[], any] = await pool.query(
            `
        SELECT id, name, description, initial_date, final_date, status
        FROM projects
        LIMIT ? OFFSET ?
        `,
            [pageSize, offset]
        );

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM projects
        `
        );

        const totalData = countRows[0]?.total || 0;

        const projects = rows.map(
            (row) =>
                new Project(
                    row.name,
                    row.description,
                    row.initial_date,
                    row.final_date,
                    row.status,
                    row.id
                )
        );

        return {
            data: projects,
            totalData: totalData,
        };
    }

    static async findById(pool: Pool, id: number): Promise<Project | null> {
        const [rows] = await pool.query<any[]>(
            `SELECT * FROM projects WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) return null;
        const project = rows[0];
        return new Project(
            project.name,
            project.description,
            project.initial_date,
            project.final_date,
            project.status,
            project.id
        );
    }

    static async update(pool: Pool, project: Project): Promise<void> {
        await pool.query(
            `UPDATE projects SET name = ?, description = ?, initial_date = ?, final_date = ?, status = ? WHERE id = ?`,
            [
                project.name,
                project.description,
                project.initial_date,
                project.final_date,
                project.status,
                project.id,
            ]
        );
    }

    static async delete(pool: Pool, id: number): Promise<void> {
        await pool.query(`DELETE FROM projects WHERE id = ?`, [id]);
    }

    static async linkUserToProject(
        pool: Pool,
        projectId: number,
        userId: number
    ): Promise<{ success: boolean; message: string }> {
        const [rows]: [any[], any] = await pool.query(
            `SELECT * FROM projects_users WHERE project_id = ? AND user_id = ?`,
            [projectId, userId]
        );
        if (rows.length > 0) {
            return {
                success: false,
                message: "User already linked to project",
            };
        }
        await pool.query(
            `INSERT INTO projects_users (project_id, user_id) VALUES (?, ?)`,
            [projectId, userId]
        );

        return {
            success: true,
            message: "User linked to project successfully",
        };
    }

    static async getUsersForProject(
        pool: Pool,
        projectId: number
    ): Promise<{ data: any[]; totalData: number }> {
        const [rows]: [any[], any] = await pool.query(
            `
        SELECT u.id, u.name, u.email, u.role
        FROM users u
        INNER JOIN projects_users pu ON u.id = pu.user_id
        WHERE pu.project_id = ?
        `,
            [projectId]
        );

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM users u
        INNER JOIN projects_users pu ON u.id = pu.user_id
        WHERE pu.project_id = ?
        `,
            [projectId]
        );

        const totalData = countRows[0]?.total || 0;

        return {
            data: rows,
            totalData: totalData,
        };
    }

    static async getUsersForProjectFiltered(
        pool: Pool,
        projectId: number,
        page: number,
        pageSize: number
    ): Promise<{ data: any[]; totalData: number }> {
        const offset = page * pageSize;
        const [rows]: [any[], any] = await pool.query(
            `
        SELECT u.id, u.name, u.email, u.role
        FROM users u
        INNER JOIN projects_users pu ON u.id = pu.user_id
        WHERE pu.project_id = ?
        LIMIT ? OFFSET ?
        `,
            [projectId, pageSize, offset]
        );

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM users u
        INNER JOIN projects_users pu ON u.id = pu.user_id
        WHERE pu.project_id = ?
        `,
            [projectId]
        );

        const totalData = countRows[0]?.total || 0;

        return {
            data: rows,
            totalData: totalData,
        };
    }

    static async getProjectsForUser(
        pool: Pool,
        userId: number
    ): Promise<{ data: any[]; totalData: number }> {
        const [rows]: [any[], any] = await pool.query(
            `
        SELECT p.id, p.name, p.description, p.initial_date, p.final_date, p.status
        FROM projects p
        INNER JOIN projects_users pu ON p.id = pu.project_id
        WHERE pu.user_id = ?
        `,
            [userId]
        );

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM projects p
        INNER JOIN projects_users pu ON p.id = pu.project_id
        WHERE pu.user_id = ?
        `,
            [userId]
        );

        const totalData = countRows[0]?.total || 0;

        return {
            data: rows,
            totalData: totalData,
        };
    }

    static async getProjectsForUserFiltered(
        pool: Pool,
        userId: number,
        page: number,
        pageSize: number
    ): Promise<{ data: any[]; totalData: number }> {
        const offset = page * pageSize;
        const [rows]: [any[], any] = await pool.query(
            `
        SELECT p.id, p.name, p.description, p.initial_date, p.final_date, p.status
        FROM projects p
        INNER JOIN projects_users pu ON p.id = pu.project_id
        WHERE pu.user_id = ?
        LIMIT ? OFFSET ?
        `,
            [userId, pageSize, offset]
        );

        const [countRows]: [any[], any] = await pool.query(
            `
        SELECT COUNT(*) as total
        FROM projects p
        INNER JOIN projects_users pu ON p.id = pu.project_id
        WHERE pu.user_id = ?
        `,
            [userId]
        );

        const totalData = countRows[0]?.total || 0;

        return {
            data: rows,
            totalData: totalData,
        };
    }

    static async deleteUserFromProject(
        pool: Pool,
        projectId: number,
        userId: number
    ): Promise<void> {
        await pool.query(
            `DELETE FROM projects_users WHERE project_id = ? AND user_id = ?`,
            [projectId, userId]
        );
    }
}
