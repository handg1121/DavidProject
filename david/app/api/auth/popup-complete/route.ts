export async function GET() {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><title>Authentication Complete</title></head>
<body>
<script>
  try {
    if (window.opener) {
      window.opener.postMessage('auth:complete', '*');
    }
  } catch (e) {}
  // 팝업은 보안을 위해 자동 close가 막힐 수 있어 버튼도 제공
</script>
<p style="font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:20px;">로그인이 완료되었습니다. 이 창을 닫아주세요.</p>
<button onclick="window.close()" style="padding:8px 12px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;margin:20px;">창 닫기</button>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
} 