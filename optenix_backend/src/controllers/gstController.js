import axios from "axios";

export const verifyGST = async (req, res) => {
  const { gstNumber } = req.body;

  if (!gstNumber) {
    return res.status(400).json({ message: "GST number is required" });
  }

  try {
    // 🔹 Example using GST API Provider
    const response = await axios.get(
      `https://api.mastergst.com/public/search?gstin=${gstNumber}`,
      {
        headers: {
          client_id: process.env.GST_CLIENT_ID,
          client_secret: process.env.GST_CLIENT_SECRET,
        },
      }
    );

    const data = response.data;

    if (!data || !data.data) {
      return res.status(400).json({ message: "Invalid GST Number" });
    }

    res.json({
      companyName: data.data.lgnm,   // Legal Name
      address: data.data.pradr?.addr?.bnm || "",
      status: data.data.sts,
    });

  } catch (error) {
    console.error("GST API Error:", error.message);

    return res.status(400).json({
      message: "GST verification failed",
    });
  }
};