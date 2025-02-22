import { pdf } from "pdf-to-img";
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';

const A4_WIDTH = 2480;
const A4_HEIGHT = 3500;

export async function generateThumbnail(pdfBuffer) {
    try {
        const tempDir = await fs.mkdtemp(join(os.tmpdir(), 'pdf-thumb-'))
        const tempPdfPath = join(tempDir, 'input.pdf')

        await fs.writeFile(tempPdfPath, pdfBuffer)

        const document = await pdf(tempPdfPath)
        for await (const img of document) {
            const thumbnail = await sharp(img)
                .resize({
                    width: A4_WIDTH,
                    height: A4_HEIGHT,
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .toFormat('png')
                .toBuffer();
            return thumbnail
        }
    } catch (err) {
        throw new Error(err)
    }
}