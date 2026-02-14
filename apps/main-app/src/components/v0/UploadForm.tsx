'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, FileImage, MapPin, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import exifr from 'exifr'
import { toast } from 'sonner' // Assuming sonner is installed as per plan

export interface FileWithPreview extends File {
    preview: string
    id: string
    uploadProgress: number
    status: 'pending' | 'uploading' | 'success' | 'error'
    gps?: { lat: number; lng: number }
    error?: string
}

interface UploadFormProps {
    onUpload: (files: FileWithPreview[]) => Promise<void>
    maxFiles?: number
    maxSizeMB?: number
    isUploading?: boolean
}

export function UploadForm({ onUpload, maxFiles = 10, maxSizeMB = 10, isUploading = false }: UploadFormProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (files.length + acceptedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files.`)
            return
        }

        const newFiles: FileWithPreview[] = []

        for (const file of acceptedFiles) {
            // Size validation
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast.error(`${file.name} is too large (>${maxSizeMB}MB)`)
                continue
            }

            const id = Math.random().toString(36).substring(7)
            const preview = URL.createObjectURL(file)

            // GPS Extraction
            let gps = undefined
            try {
                const exifData = await exifr.parse(file)
                if (exifData && exifData.latitude && exifData.longitude) {
                    gps = { lat: exifData.latitude, lng: exifData.longitude }
                }
            } catch (e) {
                console.warn("Could not extract EXIF", e)
            }

            newFiles.push({
                ...file, // Spread file properties but keep it as File object mostly
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                preview,
                id,
                uploadProgress: 0,
                status: 'pending',
                gps
            } as FileWithPreview) // Cast because File properties are read-only but we are creating a hybrid object for state
        }

        setFiles(prev => [...prev, ...newFiles])
    }, [files, maxFiles, maxSizeMB])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        disabled: isUploading
    })

    const removeFile = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const handleSubmit = async () => {
        if (files.length === 0) return
        await onUpload(files)
    }

    return (
        <div className="w-full space-y-6">
            <div
                {...getRootProps()}
                className={`
            border-2 border-dashed rounded-xl p-10 transition-all duration-300 cursor-pointer text-center
            ${isDragActive ? 'border-[#2E75B6] bg-[#2E75B6]/10' : 'border-gray-700 hover:border-gray-500 bg-[#262626]'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={`p-4 rounded-full ${isDragActive ? 'bg-[#2E75B6]/20 text-[#2E75B6]' : 'bg-gray-800 text-gray-400'}`}>
                        <UploadCloud className="h-10 w-10" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {isDragActive ? 'Drop photos here' : 'Drag photos here or click to browse'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            JPG or PNG, max {maxSizeMB}MB each
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <Card key={file.id} className="bg-[#262626] border-[#333] overflow-hidden group relative">
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                                />
                                <button
                                    onClick={(e) => removeFile(file.id, e)}
                                    disabled={isUploading && file.status !== 'error'}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                {file.gps && (
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-[10px] text-white flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-green-400" />
                                        <span>GPS Found</span>
                                    </div>
                                )}
                                {!file.gps && (
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-[10px] text-white flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 text-yellow-400" />
                                        <span>No GPS</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-300 truncate max-w-[80%]">{file.name}</p>
                                    <span className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                </div>
                                {file.status === 'uploading' && (
                                    <Progress value={file.uploadProgress} className="h-1.5 bg-gray-700" />
                                )}
                                {file.status === 'success' && (
                                    <div className="flex items-center text-green-500 text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Uploaded
                                    </div>
                                )}
                                {file.status === 'error' && (
                                    <div className="flex items-center text-red-500 text-xs">
                                        <AlertCircle className="h-3 w-3 mr-1" /> Error
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-[#333]">
                    <Button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="bg-[#2E75B6] hover:bg-[#235a8f] text-white min-w-[200px]"
                    >
                        {isUploading ? 'Uploading...' : `Submit ${files.length} Checkings`}
                    </Button>
                </div>
            )}
        </div>
    )
}
