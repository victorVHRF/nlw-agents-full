import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateRoomsResponse } from "./types/create-room-response"
import type { CreateRoomsRequest } from "./types/create-rooms-request"

export function useCreateRoom() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateRoomsRequest) => {
            const response = await fetch('http://localhost:3333/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result: CreateRoomsResponse = await response.json()

            return result
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-rooms'] })
        }
    })
}