import multer from "multer";
import fs from 'fs';
import path from 'path';
import type { Request } from "express";
import type { FileFilterCallback } from "multer";


const uploadDirectory = path.resolve(
    __dirname, "..", "..", "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }

});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const { fieldname, mimetype } = file;

    const isImage = mimetype.startsWith("image/");
    const isPDF = mimetype === "application/pdf";

    if (isImage || isPDF) {
        cb(null, true);
    }
    else {
        cb(
            new Error(
                `Invalid file type for ${fieldname}. 
                Expected pdf or image,
                Recieved ${mimetype}`
            )
        );
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    },
});


