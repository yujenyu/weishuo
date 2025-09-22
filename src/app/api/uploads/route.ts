import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 使用 Node.js runtime（非 Edge）
export const runtime = 'nodejs';

/** 單檔大小上限（MB） */
const MAX_MB = 5;

// 允許的 MIME 類型
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

// 允許的副檔名（搭配上方 MIME，任一通過即可）
const ACCEPTED_EXT = ['jpg', 'jpeg', 'png', 'webp'];

// 從檔名推測副檔名（全小寫，不含點）
function guessExt(filename: string) {
  const m = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m?.[1] ?? '';
}

// 型別驗證：允許「MIME 或 副檔名」其一通過
function isAccepted(mime: string | undefined, ext: string) {
  const okMime = mime ? ACCEPTED_MIME.includes(mime) : false;
  const okExt = ACCEPTED_EXT.includes(ext);
  return okMime || okExt;
}

// 淨化檔名的基底, 僅保留英數/底線/減號/點，避免路徑注入與奇怪字元
function sanitizeBase(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/[^\w.-]/g, '_') || 'upload';
}

// 產生唯一、安全的儲存路徑
function buildPath(filename: string, prefix = 'uploads') {
  const ext = (guessExt(filename) || 'bin').toLowerCase();
  const base = sanitizeBase(filename);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}/${Date.now()}-${rand}-${base}.${ext}`;
}

export async function POST(req: Request) {
  try {
    // 1) 從 multipart/form-data 取檔案
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    // 2) 型別驗證（MIME 與 副檔名 任一通過即可）
    const ext = guessExt(file.name);
    if (!isAccepted(file.type, ext)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 },
      );
    }

    // 3) 大小驗證（MB）
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_MB) {
      return NextResponse.json(
        { error: `File too large (> ${MAX_MB}MB)` },
        { status: 400 },
      );
    }

    // 建立 Server 端 Supabase Client
    const supabase = createClient(
      process.env.SUPABASE_URL!, // 或 NEXT_PUBLIC_SUPABASE_URL
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // **只在伺服器**
      { auth: { persistSession: false } }, // 伺服器端不需要持久化使用者 session
    );

    // 目標 bucket 與儲存路徑
    const bucket = process.env.SUPABASE_BUCKET!;
    const path = buildPath(file.name, 'uploads');

    // 在 Node 環境最穩定的上傳：先把 File -> ArrayBuffer -> Buffer
    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // 決定 contentType
    const contentType =
      file.type ||
      (ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'png'
          ? 'image/png'
          : ext === 'webp'
            ? 'image/webp'
            : 'application/octet-stream');

    // 寫入 Storage
    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType,
        upsert: false,
        // cacheControl: '3600',
      });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    // 取得公開網址, 直接給前端顯示用的 URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const imageUrl = data.publicUrl;

    // 回傳 path 與 imageUrl
    return NextResponse.json({ path, imageUrl });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Upload failed' },
      { status: 500 },
    );
  }
}
