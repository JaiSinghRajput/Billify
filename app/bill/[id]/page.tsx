import PrintButton from "@/app/components/PrintButton";
import Link from "next/link";

async function getBill(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/bills/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function BillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBill(id);

  if (!data) {
    return (
      <div className="p-10">
        <h1>Bill not found</h1>
        <Link href="/dashboard">Go back</Link>
      </div>
    );
  }

  const { bill, vendor } = data;
  const date = new Date().toLocaleDateString();

  return (
    <div className="bg-gray-100 print:bg-white min-h-screen print:min-h-0 py-10 print:py-0">

      <PrintButton  title={`Invoice #${bill.clientName}`} />

      {/* ===== INVOICE PAGE ===== */}
      <div
        id="invoice"
        className="bg-white max-w-[210mm] mx-auto p-8 md:p-12 shadow-sm print:shadow-none text-sm print:overflow-hidden"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start">

          {/* LEFT */}
          <div className="space-y-1">

            {/* LOGO */}
            {vendor?.logo && (
              <img
                src={vendor.logo}
                alt="logo"
                className="h-14 object-contain mb-2"
              />
            )}

            <h1 className="text-xl font-bold">
              {vendor?.businessName || "Business Name"}
            </h1>

            {vendor?.address && (
              <p className="text-gray-600">{vendor.address}</p>
            )}

            {vendor?.phone && (
              <p className="text-gray-600">{vendor.phone}</p>
            )}

            {/* GST */}
            {vendor?.gstNo?.length > 0 && (
              <p className="text-gray-600">
                GST: {vendor.gstNo}
              </p>
            )}
          </div>

          {/* RIGHT */}
          <div className="text-right space-y-2">
            <h2 className="text-3xl font-bold tracking-wide text-gray-700">
              INVOICE
            </h2>

            <div className="text-sm">
              <p>
                <span className="text-gray-500">Invoice # </span>
                <span className="font-medium">
                  {bill.invoiceNumber || bill._id}
                </span>
              </p>

              <p>
                <span className="text-gray-500">Date </span>
                <span className="font-medium">{date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t my-8" />

        {/* BILL TO */}
        <div>
          <p className="text-xs uppercase text-gray-400 mb-2">
            Bill To
          </p>

          <p className="font-semibold text-base">
            {bill.clientName}
          </p>

          {bill.clientPhone && (
            <p className="text-gray-600">
              {bill.clientPhone}
            </p>
          )}
        </div>

        {/* ITEMS */}
        <div className="mt-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2 w-32">Amount</th>
              </tr>
            </thead>

            <tbody>
              {bill.items?.map((item: any, i: number) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3">
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.qty} × ₹{item.price}
                    </p>
                  </td>

                  <td className="text-right py-3 font-medium">
                    ₹{item.qty * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex justify-end mt-8">
          <div className="w-72 space-y-2">

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-lg">
                ₹{bill.total}
              </span>
            </div>

            <div className="border-t pt-2 text-xs text-gray-400 text-right">
              Inclusive of all taxes
            </div>
          </div>
        </div>

        {/* SIGNATURE */}
        {vendor?.signature && (
          <div className="mt-20 flex justify-end">
            <div className="text-center">
              <img
                src={vendor.signature}
                alt="signature"
                className="h-16 object-contain mx-auto"
              />
              <p className="text-xs text-gray-500 mt-1">
                Authorized Signature
              </p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center mt-16 text-xs text-gray-400">
          Thank you for your business
        </div>
      </div>
    </div>
  );
}
