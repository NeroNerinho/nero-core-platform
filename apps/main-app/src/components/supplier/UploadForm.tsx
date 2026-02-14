'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, File, MapPin, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import exifr from 'exifr'

interface FileWithPreview extends File {
    preview: string
    gps?: boolean
    progress: number
    status: 'uploading' | 'completed' | 'error'
}

export function UploadForm() {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [uploading, setUploading] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            // Mock file processing
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
                progress: 0,
                status: 'uploading' as const
            })

            setFiles(prev => [...prev, fileWithPreview])

            // Check GPS (Mock async check)
            exifr.parse(file).then(output => {
                if (output && output.latitude && output.longitude) {
                    setFiles(prev => prev.map(f => f.name === file.name ? { ...f, gps: true } : f))
                }
            }).catch(() => { })

            // Mock Upload Progress
            let progress = 0
            const interval = setInterval(() => {
                progress += 10
                setFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress } : f))
                if (progress >= 100) {
                    clearInterval(interval)
                    setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'completed' } : f))
                }
            }, 200)

        })
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    })

    const removeFile = (name: string) => {
        setFiles(files => files.filter(f => f.name !== name))
    }

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-blue-500/50 hover:bg-gray-900'}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-gray-800 rounded-full mb-2">
                        <UploadCloud className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Drag photos here or click to browse</h3>
                    <p className="text-sm text-gray-400">JPG or PNG, max 10MB each</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <Card key={file.name} className="relative bg-gray-900 border-gray-800 overflow-hidden">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 z-10"
                                onClick={() => removeFile(file.name)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                            <div className="relative aspect-[4/3]">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="object-cover w-full h-full opacity-80"
                                    onLoad={() => {
                                        URL.revokeObjectURL(file.preview)
                                    }}
                                />
                                {file.gps ? (
                                    <div className="absolute bottom-1 right-1 bg-green-500/90 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> GPS
                                    </div>
                                ) : (
                                    <div className="absolute bottom-1 right-1 bg-yellow-500/90 text-black text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> No GPS
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-2 space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-white truncate max-w-[100px]" title={file.name}>{file.name}</p>
                                    <span className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                </div>
                                {file.status !== 'completed' && (
                                    <Progress value={file.progress} className="h-1" />
                                )}
                                {file.status === 'completed' && (
                                    <div className="flex items-center gap-1 text-[10px] text-green-500">
                                        <CheckCircle className="h-3 w-3" /> Uploaded
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" disabled={files.length === 0 || files.some(f => f.status === 'uploading')}>
                    Submit Checking ({files.length} photos)
                </Button>
            </div>
        </div>
    )
}
