import { resolveResource } from "@tauri-apps/api/path";
import { readFile, readTextFile } from "@tauri-apps/plugin-fs";

export async function getResourcePath(url) {
  const resourcePath = await resolveResource(url);

  return resourcePath;
}

export async function loadTextFile(url) {
  const resourcePath = await resolveResource(url);
  const text = await readTextFile(resourcePath);

  return text;
}

export async function loadJpgImage(url) {
  const resourcePath = await resolveResource(url);
  const img = await readFile(resourcePath);

  let binary = '';
  const bytes = new Uint8Array(img);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  const base64 = btoa(binary);

  return `data:image/jpeg;base64,${base64}`;
}