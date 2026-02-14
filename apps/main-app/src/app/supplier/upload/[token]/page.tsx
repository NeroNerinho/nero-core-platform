'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { UploadForm, FileWithPreview } from '@/components/v0/UploadForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Building2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function SupplierUploadPage() {
    const params = useParams()
    const token = params.token as string // In MVP this is the PI Number or Media Order ID
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [mediaOrder, setMediaOrder] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        async function fetchMediaOrder() {
            if (!token) return

            // MVP: Assuming 'token' is the ID of the media_order or PI Number
            // Try ID first
            let { data, error } = await supabase
                .from('media_orders')
                .select(`
                    *,
                    campaigns (
                        name,
                        client_id,
                        clients (name, logo_url)
                    ),
                    suppliers (name)
                `)
                .eq('pi_number', token) // Try matching by PI Number first as it's more user friendly in URL
                .single()

            if (error) {
                // Fallback to ID
                const { data: dataId, error: errorId } = await supabase
                    .from('media_orders')
                    .select(`
                        *,
                        campaigns (
                            name,
                            client_id,
                            clients (name, logo_url)
                        ),
                        suppliers (name)
                    `)
                    .eq('id', token)
                    .single()

                if (dataId) {
                    data = dataId
                    error = null
                } else {
                    console.error(errorId)
                }
            }

            if (data) {
                setMediaOrder(data)
            } else {
                toast.error("Invalid or expired link.")
            }
            setLoading(false)
        }

        fetchMediaOrder()
    }, [token, supabase])

    const handleUpload = async (files: FileWithPreview[]) => {
        setUploading(true)
        let successCount = 0

        try {
            // 1. Create checking record if not exists or use existing "pending" one
            // For MVP, create a new checking attempt
            const { data: checking, error: checkingError } = await supabase
                .from('checkings')
                .insert({
                    media_order_id: mediaOrder.id,
                    status: 'pending',
                    submitted_by: `supplier_link_${token}`
                })
                .select()
                .single()

            if (checkingError) throw checkingError

            // 2. Upload photos
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${mediaOrder.id}/${checking.id}/${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('checking-photos')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error("Upload failed for " + file.name, uploadError)
                    toast.error(`Failed to upload ${file.name}`)
                    continue
                }

                const { data: publicUrlData } = supabase.storage
                    .from('checking-photos')
                    .getPublicUrl(filePath)

                // 3. Save photo metadata
                const { error: photoDbError } = await supabase
                    .from('checking_photos')
                    .insert({
                        checking_id: checking.id,
                        file_url: publicUrlData.publicUrl,
                        file_size: file.size,
                        location_address: mediaOrder.locations?.[0] || 'Unknown', // Mapper logic needed for multi-location
                        photo_type: 'close_up', // Default for MVP
                        has_gps: !!file.gps,
                        gps_latitude: file.gps?.lat,
                        gps_longitude: file.gps?.lng
                    })

                if (!photoDbError) {
                    successCount++
                }
            }

            if (successCount > 0) {
                setCompleted(true)
                toast.success("Checking submitted successfully!")

                // Update media order status
                await supabase
                    .from('media_orders')
                    .update({ status: 'checking_pending' })
                    .eq('id', mediaOrder.id)
            }

        } catch (error: any) {
            console.error(error)
            toast.error("Error submitting checking: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">Loading...</div>
    }

    if (!mediaOrder) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white p-4">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold">Invalid Link</h1>
                <p className="text-gray-400">This checking link is invalid or expired.</p>
            </div>
        )
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="bg-green-500/20 p-6 rounded-full mb-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Submission Received!</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Thank you for submitting the checking photos for <strong>{mediaOrder.pi_number}</strong>.
                    Our team will review them shortly.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline" className="border-gray-700 text-white">
                    Submit Another
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#2E75B6]">
                        <Badge variant="outline" className="border-[#2E75B6] text-[#2E75B6]">{mediaOrder.media_type?.toUpperCase()}</Badge>
                        <span className="text-sm font-medium">Checking Submission</span>
                    </div>
                    <h1 className="text-3xl font-bold">{mediaOrder.campaigns?.clients?.name} - {mediaOrder.campaigns?.name}</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">{mediaOrder.pi_number}</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        <Card className="bg-[#262626] border-[#333] text-gray-300">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Campaign Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Supplier</p>
                                        <p className="font-medium text-white">{mediaOrder.suppliers?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Period</p>
                                        <p className="font-medium text-white">
                                            {new Date(mediaOrder.start_date).toLocaleDateString()} - {new Date(mediaOrder.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Locations ({mediaOrder.locations?.length || 0})</p>
                                        <div className="text-sm mt-1 space-y-1">
                                            {mediaOrder.locations?.map((loc: any, i: number) => (
                                                <div key={i} className="bg-black/30 p-2 rounded text-xs">{typeof loc === 'string' ? loc : JSON.stringify(loc)}</div>
                                            ))}
                                            {!mediaOrder.locations && <span className="text-xs italic text-gray-600">No specific locations listed</span>}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
                            <h4 className="text-blue-400 font-medium mb-2 text-sm">Instructions</h4>
                            <ul className="text-xs text-blue-200/70 space-y-1 list-disc list-inside">
                                <li>Upload close-up photos of the art.</li>
                                <li>Upload wide-angle photos showing context.</li>
                                <li>Ensure photos have GPS enabled if possible.</li>
                                <li>Max 10MB per file.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Upload Area */}
                    <div className="md:col-span-2">
                        <Card className="bg-[#262626] border-[#333]">
                            <CardContent className="p-6">
                                <UploadForm
                                    onUpload={handleUpload}
                                    isUploading={uploading}
                                    maxFiles={10}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
