import { create } from "zustand"
import axios from "axios"
import { Receipt } from "@/types/receipts.types"

interface ReceiptsState {
  receipts: Receipt[]
  loading: boolean
  fetchReceipts: () => Promise<void>
}

export const useReceiptsStore = create<ReceiptsState>((set) => ({

  receipts: [],
  loading: false,

  fetchReceipts: async () => {

    set({ loading: true })

    // MOCK DATA (simulate backend)
    const data: Receipt[] = [
      {
        id: "1",
        reference: "WH/IN/0001",
        from: "Vendor",
        to: "WH/Stock1",
        contact: "Azure Interior",
        scheduleDate: "2024-03-12",
        status: "Ready",
      },
      {
        id: "2",
        reference: "WH/IN/0002",
        from: "Vendor",
        to: "WH/Stock1",
        contact: "Azure Interior",
        scheduleDate: "2024-03-13",
        status: "Draft",
      },
    ]

    // simulate request delay
    await new Promise((res) => setTimeout(res, 500))

    set({
      receipts: data,
      loading: false
    })
  }

}))