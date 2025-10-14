function cleanTextInput(v?: string) {
  // 去頭尾空白；遇到空、'null'、'undefined' → 視為未填（undefined）
  const s = v?.trim();
  if (!s) return undefined;
  const lower = s.toLowerCase();
  if (lower === 'null' || lower === 'undefined') return undefined;
  return s;
}

function cleanUrlInput(v?: string) {
  const s = cleanTextInput(v);
  if (!s) return undefined;
  // 僅接受 http/https 開頭
  if (!/^https?:\/\//i.test(s)) return undefined;
  return s;
}

// 必填驗證
export function validatePostInput(raw: {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
}) {
  const title = cleanTextInput(raw.title);
  const description = cleanTextInput(raw.description);
  const content = cleanTextInput(raw.content);
  const imageUrl = cleanUrlInput(raw.imageUrl);

  const errors: Record<string, string> = {};
  if (!title) errors.title = '標題為必填';
  if (!description) errors.description = '描述為必填';
  if (!content) errors.content = '內容為必填';
  if (!imageUrl) errors.imageUrl = '請上傳圖片';

  return { title, description, content, imageUrl, errors } as const;
}
