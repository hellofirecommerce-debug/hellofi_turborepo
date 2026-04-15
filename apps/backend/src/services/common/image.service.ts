import sharp from "sharp";
import { throwServerError } from "../../lib/utils/error";

interface ResizeOptions {
  width: number;
  height: number;
  quality?: number;
}

class ImageService {
  async compress(buffer: Buffer, options: ResizeOptions): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(options.width, options.height)
        .webp({ quality: options.quality ?? 80 })
        .toBuffer();
    } catch (error) {
      return throwServerError("Image compression failed");
    }
  }

  async compressToMultipleSizes(
    buffer: Buffer,
    sizes: { key: string; width: number; height: number }[],
  ): Promise<{ key: string; buffer: Buffer }[]> {
    try {
      return await Promise.all(
        sizes.map(async (size) => ({
          key: size.key,
          buffer: await this.compress(buffer, {
            width: size.width,
            height: size.height,
          }),
        })),
      );
    } catch (error) {
      return throwServerError("Image processing failed");
    }
  }
}

export default new ImageService();
