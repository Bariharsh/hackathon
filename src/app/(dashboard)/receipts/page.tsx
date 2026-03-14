"use client"

import { useEffect } from "react"
import { useReceiptsStore } from "@/store/receipts.store"
import ReceiptsTable from "@/components/receipts/ReceiptsTable"

export default function ReceiptsPage() {

  const { receipts, fetchReceipts, loading } = useReceiptsStore()

  useEffect(() => {
    fetchReceipts()
  }, [])

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Receipts
        </h1>

        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          New
        </button>

      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-500">Loading receipts...</p>
      )}

      {/* Empty State */}
      {!loading && receipts.length === 0 && (
        <p className="text-gray-500">No receipts found</p>
      )}

      {/* Table */}
      {!loading && receipts.length > 0 && (
        <ReceiptsTable receipts={receipts} />
      )}

    </div>
  )
}