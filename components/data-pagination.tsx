import { Button } from "@/components/ui/button"

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const DataPagination = ({
  page,
  totalPages,
  onPageChange,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 w-full px-2">
      <div className="text-[13px] text-[#8892b0]">
        Page <span className="font-semibold text-white/90">{page}</span> of{" "}
        <span className="font-semibold text-white/90">{totalPages || 1}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          disabled={page <= 1}
          className="w-24 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-[#8892b0] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/[0.02] disabled:hover:text-[#8892b0]"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          disabled={page >= totalPages}
          className="w-24 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-[#8892b0] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/[0.02] disabled:hover:text-[#8892b0]"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}