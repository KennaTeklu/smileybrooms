"use client"

import type React from "react"
import { useState } from "react"
import type { Room } from "@/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteRoom } from "@/actions/delete-room"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import SimpleCustomizationPanel from "@/components/simple-customization-panel"

interface RoomCategoryProps {
  category: {
    id: string
    name: string
  }
  rooms: Room[]
}

const RoomCategory: React.FC<RoomCategoryProps> = ({ category, rooms }) => {
  const [isCustomizing, setIsCustomizing] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: deleteRoomMutation } = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      toast.success("Room deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete room")
    },
  })

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.description || "No description"}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  Created at: {new Date(room.createdAt).toLocaleDateString()}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/rooms/edit/${room.id}`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsCustomizing(true)}>Customize</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        deleteRoomMutation({ id: room.id })
                      }}
                      className="text-red-500 focus:text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <>
            <Skeleton className="w-full h-32 rounded-md" />
            <Skeleton className="w-full h-32 rounded-md" />
            <Skeleton className="w-full h-32 rounded-md" />
            <Skeleton className="w-full h-32 rounded-md" />
          </>
        )}
      </div>
      <SimpleCustomizationPanel
        isOpen={isCustomizing}
        onClose={() => setIsCustomizing(false)}
        roomType={category.id}
        roomName={rooms[0]?.name || "default"}
      />
    </div>
  )
}

export default RoomCategory
