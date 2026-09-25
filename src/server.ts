import express, { type Request, type Response } from "express"
import tesseract from "tesseract.js"
import multer from "multer"
import fs from "fs/promises"


const upload = multer({
  dest: "temp/",
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.includes("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type"))
    }
  }
})

const app = express()


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello world, welcome to mass RedFlag api" })
})


app.post("/test", upload.single("file"), async (req: Request, res: Response) => {
  const filePath = req.file?.path
  if (!filePath) {
    return res.status(400).json({ message: "Something went wrong" })
  }
  const imgText = await tesseract.recognize(filePath)
  await fs.unlink(filePath)
  res.json({ text: imgText.data.text })
})




const PORT = 3000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))
