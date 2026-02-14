'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react'
import jsPDF from 'jspdf'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    checking: any
    onApprove: () => void
    onReject: (reason: string) => void
}

export function ApprovalModal({ open, onOpenChange, checking, onApprove, onReject }: Props) {
    const [rejectReason, setRejectReason] = useState('')
    const [showRejectForm, setShowRejectForm] = useState(false)

    if (!checking) return null

    const handleReject = () => {
        // Generate PDF logic would go here
        const doc = new jsPDF()
        doc.text(`Rejection Report for ${checking.piNumber}`, 10, 10)
        doc.text(`Reason: ${rejectReason}`, 10, 20)
        // doc.save('rejection.pdf') // Auto download for demo

        onReject(rejectReason)
        setShowRejectForm(false)
        setRejectReason('')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-gray-100">
                <DialogHeader>
                    <DialogTitle className="text-xl text-white flex items-center gap-2">
                        <span>Checking Review: {checking.piNumber}</span>
                        <span className="text-sm font-normal text-gray-400">({checking.client})</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Review photos and GPS data before approving.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                    {checking.photos.map((photo: any, index: number) => (
                        <div key={index} className="relative group">
                            <img
                                src={photo.url}
                                alt="Checking"
                                className="w-full h-48 object-cover rounded-md border border-gray-700"
                            />
                            <div className="absolute top-2 right-2">
                                {photo.gps ? (
                                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <CheckCircle className="h-3 w-3" /> GPS
                                    </div>
                                ) : (
                                    <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <AlertTriangle className="h-3 w-3" /> No GPS
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {photo.type}
                            </div>
                        </div>
                    ))}
                </div>

                {showRejectForm ? (
                    <div className="space-y-4 bg-red-900/20 p-4 rounded-md border border-red-900/50">
                        <h4 className="text-sm font-semibold text-red-400">Rejection Reason</h4>
                        <Textarea
                            placeholder="Describe why this checking is rejected..."
                            className="bg-gray-950 border-gray-800 text-white"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setShowRejectForm(false)} className="text-gray-400">Cancel</Button>
                            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>
                                Confirm Rejection & Generate PDF
                            </Button>
                        </div>
                    </div>
                ) : (
                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button variant="outline" className="border-gray-700 text-gray-300">
                            <Download className="mr-2 h-4 w-4" /> Download All
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => setShowRejectForm(true)}
                                className="bg-red-900 hover:bg-red-800 text-white"
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button
                                onClick={() => onApprove()}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve checking
                            </Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
