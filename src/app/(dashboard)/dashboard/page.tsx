"use client"

import { useEffect } from "react"
import { useDashboardStore } from "@/store/dashboard.store"
import OperationCard from "@/components/dashboard/OperationCard"

export default function DashboardPage() {

  const { data, fetchDashboard } = useDashboardStore()

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <OperationCard
  title="Receipts"
  buttonText={`${data.receipts.toReceive} to receive`}
  stats={[
    `${data.receipts.late} Late`,
    `${data.receipts.operations} operations`
  ]}
  route="/receipts"
/>

<OperationCard
  title="Deliveries"
  buttonText={`${data.deliveries.toReceive} to deliver`}
  stats={[
    `${data.deliveries.late} Late`,
    `${data.deliveries.operations} operations`
  ]}
  route="/deliveries"
/>

      </div>

    </div>
  )
}