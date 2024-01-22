import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FileHelper {
  async deleteFile(fileName: string): Promise<void> {
    // Assuming 'images' is in the project root
    const imagePath = path.resolve(__dirname, '../../images', fileName);

    try {
      await fs.access(imagePath);
      await fs.unlink(imagePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
