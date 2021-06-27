import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { FileUpload } from 'graphql-upload';
import { makeId } from './postHelper';

interface FileUploadResponse {
  Urn?: string;
  isUploaded: boolean;
  error?: string;
}

export const uploadFile = async (
  file: FileUpload,
  fileType: 'image' | 'video'
): Promise<FileUploadResponse> => {
  const { filename, createReadStream, mimetype } = await file;
  console.log('filw_output', file);
  if (mimetype && !mimetype.includes(fileType)) {
    throw new Error(`Unsupported file type: ${mimetype.split('/')[0]}`);
  }
  const fileName = `${makeId(15)}_${new Date().toISOString()}_${filename}`;
  const destination = `public/${fileType}s/`;
  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }
  const filePath = destination + fileName;
  const fileUrn = `${fileType}s/${fileName}`;
  return new Promise((res) =>
    createReadStream()
      .pipe(createWriteStream(filePath))
      .on('drain', () => {
        console.log('file uploading');
      })
      .on('close', () => {
        console.log('file uploaded');
        res({
          Urn: fileUrn,
          isUploaded: true,
        });
      })
      .on('error', (err) => {
        console.error('file upload fail');
        res({
          isUploaded: false,
          error: err.message,
        });
      })
  );
};
