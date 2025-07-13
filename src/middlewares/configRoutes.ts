import { Express } from "express";
import defaultRouter from "../routes/default.router";

export default function configRoutes(server: Express) {
	server.use("/", defaultRouter);
}
