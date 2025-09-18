import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // Service Role 需 Node 環境，避免 Edge

// 可依需求調整
const MAX_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    if (!ACCEPTED.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 },
      );
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_MB) {
      return NextResponse.json(
        { error: `File too large (> ${MAX_MB}MB)` },
        { status: 400 },
      );
    }

    // 後端使用 Service Role 上傳，避免把金鑰曝露給前端
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // 僅伺服器端
    );

    // 生成安全路徑：uploads/時間戳-隨機-淨化檔名.副檔名
    const original = file.name || 'upload';
    const ext = original.includes('.') ? original.split('.').pop()! : 'bin';
    const base = original.replace(/\.[^.]+$/, '');
    const safeBase = base.replace(/[^\w.-]/g, '_');
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeBase}.${ext}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
        // 可選：設定快取（秒），CDN 會更有效率
        // cacheControl: '3600',
      });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Public bucket：直接取 public URL
    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(path);

    // 回傳 path（備用）與 publicUrl（前端直接顯示/入庫）
    return NextResponse.json({ path, publicUrl: data.publicUrl });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Upload failed' },
      { status: 500 },
    );
  }
}
