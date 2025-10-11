import Requests from "src/models/servicerequestCollegeSeminarsModel.js";

export const submitRequest = async (req, res) => {
  try {
    const request = new Requests(req.body);
    await request.save();
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
