'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import type { Item, CreateForm } from '../types';
import { PAGE_SIZE } from '../lib/constants';
import { validatePostInput } from '../lib/validators';

// 管理頁籤、分頁、載入、錯誤、Dialog 表單與建立流程的整合 hook
export function useResources() {
  // 0=SHARE, 1=NEED
  const [activeTab, setActiveTab] = useState(0);

  // list / paging
  const [items, setItems] = useState<Item[]>([]); // 以 API 回來的 items 取代 mock
  const [skip, setSkip] = useState(0); // 分頁
  const [total, setTotal] = useState(0); // 總筆數
  const [loading, setLoading] = useState(true); // 載入狀態, 控制清單級 Skeleton
  const [error, setError] = useState<string | null>(null); // 錯誤訊息

  // dialog + form
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreateForm>({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
  });
  const [showErrors, setShowErrors] = useState(false);

  // 上傳集中狀態
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  // auth
  const { status } = useSession();
  const isAuthed = status === 'authenticated';

  // 依 tab 決定呼叫 shares 或 needs
  const typePath = useMemo(
    () => (activeTab === 0 ? 'shares' : 'needs'),
    [activeTab],
  );

  function handleCreateClick() {
    if (!isAuthed) {
      signIn(); // 可 signIn('google') 指定 provider
      return;
    }
    setShowErrors(false);
    setOpen(true);
  }

  async function fetchPostsPage(initial = false) {
    // 初次(initial=true) 一定要放行；只有在非初次又正在載入時才擋掉重複請求
    if (loading && !initial) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/${typePath}?take=${PAGE_SIZE}&skip=${initial ? 0 : skip}`,
        { cache: 'no-store' },
      );
      const data = await res.json();
      if (initial) {
        setItems(data.items);
        setSkip(data.take);
      } else {
        setItems((prev) => [...prev, ...data.items]);
        setSkip((prev) => prev + data.take);
      }
      setTotal(data.total);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '載入失敗';
      setError(msg);
    } finally {
      setLoading(false); // 完成後結束清單級 Skeleton
    }
  }

  async function postWithAuth<T>(
    url: string,
    body: unknown,
  ): Promise<T | null> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      signIn(); // 未登入 → 轉跳登入畫面
      return null;
    }

    if (!res.ok) {
      const raw: unknown = await res.json().catch(() => undefined);

      let message = '請求失敗';
      if (raw && typeof raw === 'object') {
        // 這裡用最簡單的斷言來取欄位，不用 any
        const { error, details } = raw as {
          error?: string;
          details?: Array<{ message?: string }>;
        };

        const fromDetails =
          details
            ?.map((d) => d?.message)
            .filter(Boolean)
            .join('；') ?? '';

        message = fromDetails || error || message;
      }

      throw new Error(message);
    }
    return res.json() as Promise<T>;
  }

  // For Dialog upload photo
  async function handleFileChange(file?: File | null) {
    if (!file) return;
    setUploadErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/uploads', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '上傳失敗');

      // 回填 imageUrl（供後端 Zod 驗證與提交使用）
      setForm((prev) => ({ ...prev, imageUrl: json.imageUrl }));
    } catch (e: unknown) {
      const msg = e instanceof Error && e.message ? e.message : '上傳失敗';
      setUploadErr(msg);
    } finally {
      setUploading(false);
    }
  }

  async function createItem() {
    try {
      // 建立中狀態
      setCreating(true);
      // 按下建立才開始顯示紅框
      setShowErrors(true);

      const { title, description, content, imageUrl, errors } =
        validatePostInput(form);

      // 若仍有錯誤，直接擋下（避免 race condition）
      if (Object.keys(errors).length > 0) {
        return;
      }

      const payload = { title, description, content, imageUrl };
      const data = await postWithAuth<{ item: Item }>(
        `/api/${typePath}`,
        payload,
      );
      if (!data) return; // 已觸發登入

      // 樂觀更新 + 立即重抓第一頁
      setItems((prev) => [data.item, ...prev]);
      setTotal((t) => t + 1);

      // 重新抓第一頁：呼叫正確的函式（確保排序、總數一致）
      await fetchPostsPage(true);

      // 清空並關閉 Dialog
      setForm({ title: '', description: '', content: '', imageUrl: '' });
      setOpen(false);
      // 成功後關閉並重置
      setShowErrors(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '建立失敗';
      setError(msg);
    } finally {
      setCreating(false);
    }
  }

  // 切換 Tab 時清空並重新抓（與你原本 useEffect 相同邏輯）
  useEffect(() => {
    setItems([]);
    setSkip(0);
    setTotal(0);
    setLoading(true); // 讓清單級 Skeleton 先出來，避免塌陷
    fetchPostsPage(true);
  }, [activeTab]);

  const hasMore = skip < total;
  const showLoadMore = items.length > 0 || total > 0;
  const fieldErrors = validatePostInput(form).errors;
  const isSubmitDisabled = creating || uploading; // 提交同時考慮上傳中

  return {
    // state
    activeTab,
    setActiveTab,
    items,
    total,
    skip,
    loading,
    error,
    setError,
    hasMore,
    showLoadMore,

    // dialog / form
    open,
    setOpen,
    form,
    setForm,
    creating,
    isSubmitDisabled,
    showErrors,
    fieldErrors,

    // upload photo
    uploading,
    uploadErr,

    // auth
    status,
    isAuthed,

    // actions
    fetchPostsPage,
    handleCreateClick,
    createItem,

    // for dialog
    handleFileChange,
  } as const;
}
