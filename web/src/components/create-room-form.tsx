import { useCreateRoom } from '@/http/use-create-room'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { z } from 'zod/v4'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const createRoomSchema = z.object({
    name: z.string().min(3, { message: 'Inclua no minimo 3 caracteres' }),
    description: z.string()
})

type CreateRoomFormDate = z.infer<typeof createRoomSchema>

export function CreateRoomForm() {
    const { mutateAsync: createRoom } = useCreateRoom()

    const createRoomForm = useForm<CreateRoomFormDate>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    })

    async function handleCreateRoom({ name, description }: CreateRoomFormDate) {
        await createRoom({ name, description })
        createRoomForm.reset()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Criar Sala</CardTitle>
                <CardDescription>Crie uma nova sala para comecar a fazer perguntas e respostas da I.A.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...createRoomForm}>
                    <form onSubmit={createRoomForm.handleSubmit(handleCreateRoom)} className="flex flex-col gap-4">
                        <FormField
                            control={createRoomForm.control}
                            name='name'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Nome da sala</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Digite o nome da sala...' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={createRoomForm.control}
                            name='description'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Descricao</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <Button type='submit' className='w-full'>Criar sala</Button>

                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}