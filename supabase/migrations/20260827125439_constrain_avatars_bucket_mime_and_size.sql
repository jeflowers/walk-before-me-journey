/*
  # Constrain the avatars storage bucket

  1. Changes
     - Restrict `avatars` bucket uploads to JPEG, PNG and WebP images
     - Cap object size at 2 MB (2097152 bytes), matching the app's stated limit

  2. Security
     - The 2 MB / image-only rules were previously enforced only in the browser,
       so a crafted request could store HTML, SVG or an unbounded file on a
       publicly readable path. These limits are now enforced by storage itself.
*/

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
    file_size_limit = 2097152
WHERE id = 'avatars';
