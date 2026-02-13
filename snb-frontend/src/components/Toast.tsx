"use client";

type ToastType = "success" | "error" | "info";

let currentToast: HTMLElement | null = null;

function show(msg: string, type: ToastType) {
  // 如果已经有 toast，先移除
  if (currentToast) {
    currentToast.remove();
    currentToast = null;
  }

  // 遮罩层
  const mask = document.createElement("div");
  mask.className = "toast-mask";

  // Toast 本体（⚠️ 关键修复点）
  const box = document.createElement("div");
  box.className = `toast ${type}`;
  box.textContent = msg;

  mask.appendChild(box);
  document.body.appendChild(mask);
  currentToast = mask;

  // 自动关闭
  setTimeout(() => {
    mask.remove();
    currentToast = null;
  }, 2500);
}

export const toast = {
  success: (msg: string) => show(msg, "success"),
  error: (msg: string) => show(msg, "error"),
  info: (msg: string) => show(msg, "info"),
};
