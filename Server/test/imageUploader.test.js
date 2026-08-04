const { test, afterEach } = require('node:test');
const assert = require('node:assert');
const cloudinary = require('cloudinary').v2;
const { uploadImageToCloudinary } = require('../utils/imageUploader');

const originalUpload = cloudinary.uploader.upload;

afterEach(() => {
  cloudinary.uploader.upload = originalUpload;
});

test('uploadImageToCloudinary returns the upload result on success', async () => {
  cloudinary.uploader.upload = async () => ({ secure_url: 'https://res.cloudinary.com/x.jpg' });

  const result = await uploadImageToCloudinary({ tempFilePath: 'C:/tmp/img.jpg' }, 'StudyVerse');

  assert.strictEqual(result.secure_url, 'https://res.cloudinary.com/x.jpg');
});

test('uploadImageToCloudinary throws a friendly error when Cloudinary fails', async () => {
  cloudinary.uploader.upload = async () => {
    throw new Error('network down');
  };

  await assert.rejects(
    () => uploadImageToCloudinary({ tempFilePath: 'C:/tmp/img.jpg' }, 'StudyVerse'),
    (err) => err.message === 'Error while uploading image, please try again'
  );
});
