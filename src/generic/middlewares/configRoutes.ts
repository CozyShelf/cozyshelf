import { Express } from "express";
import defaultRouter from "../routes/DefaultRouter";

export default function configRoutes(server: Express) {
	server.use("/", defaultRouter);
}
