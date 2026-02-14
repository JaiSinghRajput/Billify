"use client";

export default function PrintButton() {
  return (
    <div className="text-center mb-6 print-hidden">
      <button
        onClick={() => window.print()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Download PDF
      </button>
    </div>
  );
}
