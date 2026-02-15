"use client";

export default function PrintButton({
  title,
}: {
  title: string;
}) {
  const handlePrint = () => {
    const original = document.title;

    document.title = title || "Invoice";

    window.print();

    setTimeout(() => {
      document.title = original;
    }, 300);
  };

  return (
    <div className="text-center mb-6 print-hidden">
      <button
        onClick={handlePrint}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Download PDF
      </button>
    </div>
  );
}
