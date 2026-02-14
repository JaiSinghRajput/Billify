"use client";

import { useState } from "react";
import { Item } from "@/lib/types";
import { toast } from "sonner";

export default function Generate() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isGstNumber = false;

  const [items, setItems] = useState<Item[]>([
    { name: "", qty: 1, price: 0 },
  ]);

  /* ---------- ITEM ACTIONS ---------- */

  const addItem = () =>
    setItems([...items, { name: "", qty: 1, price: 0 }]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = <K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K]
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  /* ---------- TOTALS ---------- */

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.qty) || 0) *
        (Number(item.price) || 0),
    0
  );

  const gst = isGstNumber ? subtotal * 0.18 : 0;
  const total = subtotal + gst;

  /* ---------- CREATE BILL ---------- */

  const createBill = async () => {
    if (!clientName || !clientPhone) {
      toast.error("Enter client details");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/bills/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          items,
          subtotal,
          gst,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      const link = `${window.location.origin}/bill/${data.billId}`;

      window.open(
        `https://wa.me/${clientPhone}?text=${encodeURIComponent(
          `Hello ${clientName}, your bill total is ₹${total.toFixed(
            2
          )}. View here: ${link}`
        )}`
      );

      toast.success("Bill created");
    } catch {
      toast.error("Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="max-w-6xl mx-auto px-4 pb-32 pt-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-blue-700">
          Create Invoice
        </h1>
        <p className="text-sm text-gray-500">
          Fill details and share instantly
        </p>
      </div>

      {/* CLIENT CARD */}
      <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm">
        <h2 className="font-semibold text-blue-700">
          Client Details
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          <Input
            placeholder="Client Name"
            value={clientName}
            onChange={setClientName}
          />

          <Input
            placeholder="WhatsApp Number"
            value={clientPhone}
            onChange={setClientPhone}
            inputMode="numeric"
          />
        </div>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-blue-700">
            Items
          </h2>

          <button
            onClick={addItem}
            className="bg-blue-600 active:scale-95 transition text-white text-sm px-4 py-2 rounded-xl"
          >
            Add Item
          </button>
        </div>

        {/* MOBILE CARD LIST */}
        <div className="md:hidden space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-4 space-y-3 shadow-sm"
            >
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(v) =>
                  updateItem(i, "name", v)
                }
              />

              <div className="flex gap-3">
                <Input
                  type="number"
                  value={item.qty}
                  onChange={(v) =>
                    updateItem(
                      i,
                      "qty",
                      v === "" ? "" : Number(v)
                    )
                  }
                  placeholder="Qty"
                  inputMode="numeric"
                />

                <Input
                  type="number"
                  value={item.price}
                  onChange={(v) =>
                    updateItem(
                      i,
                      "price",
                      v === "" ? "" : Number(v)
                    )
                  }
                  placeholder="Price"
                  inputMode="decimal"
                />
              </div>

              <button
                disabled={items.length === 1}
                onClick={() => removeItem(i)}
                className="text-sm text-red-500 disabled:opacity-30"
              >
                Remove Item
              </button>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="text-left p-3 w-1/2">Item</th>
                <th className="p-3 w-1/6">Qty</th>
                <th className="p-3 w-1/4">Price</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="p-2">
                    <Input
                      value={item.name}
                      onChange={(v) =>
                        updateItem(i, "name", v)
                      }
                    />
                  </td>

                  <td className="p-2">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(v) =>
                        updateItem(
                          i,
                          "qty",
                          v === "" ? "" : Number(v)
                        )
                      }
                    />
                  </td>

                  <td className="p-2">
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(v) =>
                        updateItem(
                          i,
                          "price",
                          v === "" ? "" : Number(v)
                        )
                      }
                    />
                  </td>

                  <td className="text-center">
                    <button
                      disabled={items.length === 1}
                      onClick={() => removeItem(i)}
                      className="text-red-500 disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STICKY FOOTER TOTAL */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          <div className="text-sm">
            <p className="text-gray-500">
              Total
            </p>
            <p className="text-xl font-bold text-blue-700">
              ₹{total.toFixed(2)}
            </p>
          </div>

          <button
            onClick={createBill}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold active:scale-95 transition"
          >
            {loading ? "Creating..." : "Create Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- INPUT COMPONENT ---------- */

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  value: any;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: any;
}) {
  return (
    <input
      value={value}
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  );
}
