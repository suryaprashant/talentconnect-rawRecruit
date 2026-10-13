import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker?url";

// 🔥 THIS IS THE FIX
GlobalWorkerOptions.workerSrc = workerSrc;

export default function ResumePreview() {
  const [params] = useSearchParams();
  const fileUrl = params.get("url");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!fileUrl || !canvasRef.current) return;

    const renderPdf = async () => {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();

        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (err) {
        console.error("PDF render failed:", err);
      }
    };

    renderPdf();
  }, [fileUrl]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <canvas ref={canvasRef} className="bg-white shadow-lg" />
    </div>
  );
}