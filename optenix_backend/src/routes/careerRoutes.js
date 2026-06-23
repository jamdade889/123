import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/apply",
  upload.single("resume"),
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        experience,
        coverLetter,
        position,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume is required",
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "sneha.sahare@optenix.in",
        subject: `New Job Application - ${position}`,
        html: `
          <h2>New Career Application</h2>

          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Experience:</strong> ${experience}</p>
          <p><strong>Position:</strong> ${position}</p>

          <h3>Cover Letter</h3>
          <p>${coverLetter}</p>
        `,
        attachments: [
          {
            filename: req.file.originalname,
            path: req.file.path,
          },
        ],
      });

      return res.json({
        success: true,
        message: "Application submitted successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Failed to submit application",
      });
    }
  }
);

export default router;