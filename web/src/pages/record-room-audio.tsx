import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import { Navigate, useParams } from "react-router-dom"

const isRecordingSupported =
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder === 'function'

type RecodRoomAudioParams = {
    roomId: string
}

export function RecordRoomAudio() {
    const params = useParams<RecodRoomAudioParams>()

    const [isRecording, setIsRecording] = useState(false)
    const recorder = useRef<MediaRecorder | null>(null)

    async function stopRecording() {
        setIsRecording(false)

        if (recorder.current && recorder.current.state === 'inactive') {
            recorder.current.stop()
        }

    }

    async function uploadAudio(audio: Blob) {
        const formData = new FormData()

        formData.append('file', audio, 'audio.webm')

        const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()
        console.log(result)

    }

    async function startRecording() {
        if (!isRecordingSupported) {
            alert('O seu navegador nao suporta gravacao')
            return
        }

        setIsRecording(true)

        const audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44_100,
            }
        })

        recorder.current = new MediaRecorder(audio, {
            mimeType: 'audio/webm',
            audioBitsPerSecond: 64_000
        })

        recorder.current.ondataavailable = event => {
            if (event.data.size > 0) {
                uploadAudio(event.data)
            }
        }

        recorder.current.onstart = () => {
            console.log('gravacao iniciada')

        }

        recorder.current.onstop = () => {
            console.log('pausado')

        }

        recorder.current.start()

    }

    if (!params.roomId) {
        return <Navigate replace to="/" />
    }

    return (
        <div className="h-screen flex items-center justify-center flex-col gap-3">
            {isRecording ? (
                <Button onClick={stopRecording}>Parar audio</Button>
            ) : (
                <Button onClick={startRecording}>Gravar audio</Button>
            )}
            {isRecording ? <p>Gravando...</p> : <p>Pausado</p>}
        </div>
    )
}