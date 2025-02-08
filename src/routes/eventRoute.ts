import { Router } from "express";
import bodyParser from "body-parser";
import { protect } from "../middlewares/auth";
import {
  allEvents,
  categoryAll,
  createEvent,
  deleteEvent,
  getEvent,
} from "../services/event/eventService";

const router = Router();
router.use(bodyParser.json());

router.get("/category", categoryAll);
router.get("/details/:id", getEvent);
router.get("/:cat", allEvents);
router.post("/new", protect, createEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
