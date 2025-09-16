import Button from '../../../components/ui/Button'

export default function AdminOrders() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin Orders</h2>
      </div>
      <div className="rounded-lg border border-slate-200 p-4 bg-white">
        <div className="text-slate-500">No orders yet.</div>
        <div className="mt-4">
          <Button asChild>
            <a href="tel:+910000000000">Call Agent</a>
          </Button>
        </div>
      </div>
    </div>
  )
}


