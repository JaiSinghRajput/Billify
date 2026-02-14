"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bill } from "@/lib/types";

/* ---------- COMPONENT ---------- */

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/bills/list")
      .then((res) => res.json())
      .then((data: Bill[]) => setBills(data))
      .catch(() => toast.error("Failed to load bills"))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- SEARCH FILTER ---------- */

  const filteredBills = useMemo(() => {
    if (!search.trim()) return bills;

    const q = search.toLowerCase();

    return bills.filter((bill) =>
      bill.clientName?.toLowerCase().includes(q) ||
      bill.clientPhone?.includes(q) ||
      bill.invoiceNumber?.toLowerCase().includes(q) ||
      bill._id.toLowerCase().includes(q)
    );
  }, [search, bills]);

  /* ---------- UI ---------- */

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Bills
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your invoices
          </p>
        </div>

        <Link
          href="/generate"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium active:scale-95 transition text-center"
        >
          + Generate Bill
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-white border rounded-xl p-3 shadow-sm">
        <input
          placeholder="Search by client, phone or invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500 py-20">
          Loading bills...
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredBills.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center">
          <h3 className="font-semibold text-lg">
            No bills found
          </h3>

          <p className="text-gray-500 mt-2 mb-6">
            Try changing search or create a new bill
          </p>

          <Link
            href="/generate"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
          >
            Generate Bill
          </Link>
        </div>
      )}

      {/* TABLE DESKTOP */}
      {!loading && filteredBills.length > 0 && (
        <>
          <div className="hidden md:block bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left w-16">#</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Invoice</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredBills.map((bill, i) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">
                      {i + 1}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {bill.clientName}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {bill.clientPhone || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {bill.invoiceNumber || bill._id}
                    </td>

                    <td className="px-6 py-4 text-blue-600 font-semibold">
                      ₹{bill.total}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/bill/${bill._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST */}
          <div className="md:hidden space-y-3">
            {filteredBills.map((bill, i) => (
              <div
                key={bill._id}
                className="bg-white border rounded-xl p-4 shadow-sm space-y-2"
              >
                <div className="flex justify-between">
                  <p className="font-semibold">
                    {bill.clientName}
                  </p>
                  <span className="text-blue-600 font-bold">
                    ₹{bill.total}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  <p>#{i + 1}</p>
                  <p>{bill.clientPhone}</p>
                  <p>
                    {bill.invoiceNumber || bill._id}
                  </p>
                </div>

                <Link
                  href={`/bill/${bill._id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                >
                  View Bill
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
