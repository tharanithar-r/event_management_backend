import "dotenv/config";
import { newEvent } from "../../actions/createEvent";
import { getEventbyIdAction } from "../../actions/getEventbyId";
import { allEventsAction } from "../../actions/allEvents";
import { deleteEventAction } from "../../actions/deleteEvent";
import { categoryAllAction } from "../../actions/categoryAll";

export const createEvent = async (req: any, res: any) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      endDate: new Date(req.body.endDate),
      category: req.body.category,
      location: req.body.location,
      creatorId: req.body.creatorId,
      maxAttendees: req.body.maxAttendees,
      isPublic: req.body.isPublic,
      imageUrl: req.body.imageUrl,
    };

    if (
      !eventData.title ||
      !eventData.description ||
      !eventData.date ||
      !eventData.creatorId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await newEvent(eventData);
    return res.status(200).json("Event created successfully");
  } catch (err: any) {
    console.error("Error creating event: ", err);
    res.status(400).json("Error creating event");
  }
};

export const allEvents = async (req: any, res: any) => {
  try {
    const category = req.params.cat;
    const events = await allEventsAction(category);
    return res.status(200).json(events);
  } catch (err: any) {
    console.error("Error getting all events: ", err);
    res.status(400).json("Error getting all events");
  }
};

export const getEvent = async (req: any, res: any) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const event = await getEventbyIdAction(eventId);
    return res.status(200).json(event);
  } catch (err: any) {
    console.error("Error getting event: ", err);
    res.status(400).json("Error getting event");
  }
};

export const deleteEvent = async (req: any, res: any) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }
    await deleteEventAction(eventId);
    return res.status(200).json("Event deleted successfully");
  } catch (err: any) {
    console.error("Error deleting event: ", err);
    res.status(400).json("Error deleting event");
  }
};

export const categoryAll = async (req: any, res: any) => {
  try {
    const categories = await categoryAllAction();
    return res.status(200).json(categories);
  } catch (err: any) {
    console.error("Error getting all categories: ", err);
    res.status(400).json("Error getting all categories");
  }
};
