import express, { Request, Response } from "express";
import { Project } from "../models/Project";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req: any, res: Response) => {
    const pool = req.pool;
    const filters = req.query;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        let projects;

        if (Object.keys(filters).length === 0) {
            projects = await Project.findAll(pool);
        } else {
            projects = await Project.findAllFiltered(
                pool,
                Number(filters.page),
                Number(filters.pageSize)
            );
        }

        res.status(200).json(projects);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.post("/", async (req: any, res: Response) => {
    const pool = req.pool;
    const { name, description, initial_date, final_date, status, userId } =
        req.body;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        const project = new Project(
            name,
            description,
            initial_date,
            final_date,
            status
        );
        const projectId = await Project.save(pool, project);
        await Project.linkUserToProject(pool, projectId, userId);

        const newProject = { ...project, projectId };
        res.status(201).json(newProject);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.put("/:id", async (req: any, res: Response) => {
    const pool = req.pool;
    const { id } = req.params;
    const { name, description, initial_date, final_date, status } = req.body;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        const project = new Project(
            name,
            description,
            initial_date,
            final_date,
            status,
            parseInt(id)
        );
        await Project.update(pool, project);

        res.status(200).json(project);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.delete("/:id", async (req: any, res: Response) => {
    const pool = req.pool;
    const { id } = req.params;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        await Project.delete(pool, parseInt(id));
        res.status(204).send();
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

router.post("/:projectId/users", async (req: any, res: Response) => {
    const pool = req.pool;
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        const result = await Project.linkUserToProject(pool, projectId, userId);

        if (!result.success) {
            return res.status(208).json({ error: result.message });
        }

        res.status(201).json({
            message: result.message,
            projectId: projectId,
            userId: userId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to link user to project" });
    }
});

router.get("/user/:userId", async (req: any, res: Response) => {
    const pool = req.pool;
    const { userId } = req.params;
    const filters = req.query;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        let projects;

        if (Object.keys(filters).length === 0) {
            projects = await Project.getProjectsForUser(pool, userId);
        } else {
            projects = await Project.getProjectsForUserFiltered(
                pool,
                userId,
                Number(filters.page),
                Number(filters.pageSize)
            );
        }

        // if (!projects.data.length) {
        //     return res
        //         .status(404)
        //         .json({ message: "No projects found for this user" });
        // }

        res.status(200).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to retrieve projects for the user",
        });
    }
});

router.get("/:projectId/users", async (req: any, res: Response) => {
    const pool = req.pool;
    const { projectId } = req.params;
    const filters = req.query;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        let users;

        if (Object.keys(filters).length === 0) {
            users = await Project.getUsersForProject(pool, projectId);
        } else {
            users = await Project.getUsersForProjectFiltered(
                pool,
                projectId,
                Number(filters.page),
                Number(filters.pageSize)
            );
        }

        // if (!users.data.length) {
        //     return res
        //         .status(404)
        //         .json({ message: "No users found for this project" });
        // }

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to retrieve users for the project",
        });
    }
});

router.delete("/:projectId/users/:userId", async (req: any, res: Response) => {
    const pool = req.pool;
    const { projectId, userId } = req.params;

    try {
        if (!pool) {
            return res
                .status(500)
                .json({ error: "Database connection not found" });
        }

        await Project.deleteUserFromProject(
            pool,
            parseInt(projectId),
            parseInt(userId)
        );

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to remove the user from the project",
        });
    }
});

router.post(
    "/upload-project-file",
    upload.single("file"),
    async (req: any, res: Response) => {
        const pool = req.pool;
        const userId = req.body.userId;

        if (!req.file) {
            return res.status(400).json({ error: "CSV file is required" });
        }

        try {
            const filePath = req.file.path;
            const projects: any[] = [];

            fs.createReadStream(filePath)
                .pipe(
                    csv({
                        separator: ";",
                        headers: [
                            "id",
                            "nome",
                            "descricao",
                            "data_inicio",
                            "data_fim",
                            "status",
                        ],
                        skipLines: 1,
                    })
                )
                .on("data", (row) => {
                    const { nome, descricao, data_inicio, data_fim, status } =
                        row;

                    projects.push({
                        name: nome,
                        description: descricao,
                        initial_date: data_inicio,
                        final_date: data_fim,
                        status: status,
                    });
                })
                .on("end", async () => {
                    try {
                        for (const projectData of projects) {
                            const project = new Project(
                                projectData.name,
                                projectData.description,
                                projectData.initial_date,
                                projectData.final_date,
                                projectData.status
                            );
                            const projectId = await Project.save(pool, project);
                            await Project.linkUserToProject(
                                pool,
                                projectId,
                                userId
                            );
                        }

                        fs.unlinkSync(filePath);

                        res.status(201).json({
                            message:
                                "Projects uploaded and processed successfully",
                        });
                    } catch (error) {
                        console.error(
                            "Error while processing projects:",
                            error
                        );
                        res.status(500).json({
                            error: "Error processing projects",
                        });
                    }
                })
                .on("error", (error) => {
                    console.error("Error reading CSV file:", error);
                    res.status(500).json({ error: "Error reading CSV file" });
                });
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(400).json({ error: err.message });
            } else {
                res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
);

export default router;
