<?php

namespace App\Mail;

use App\Models\MlsChangeRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MlsChangeRequestToAdmin extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public MlsChangeRequest $changeRequest
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $typeLabel = MlsChangeRequest::REQUEST_TYPES[$this->changeRequest->request_type] ?? ucfirst(str_replace('_', ' ', $this->changeRequest->request_type));

        return new Envelope(
            subject: 'New MLS Change Request - ' . $typeLabel,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.mls-change-request-admin',
            with: [
                'changeRequest' => $this->changeRequest,
                'property' => $this->changeRequest->property,
                'user' => $this->changeRequest->user,
                'typeLabel' => MlsChangeRequest::REQUEST_TYPES[$this->changeRequest->request_type] ?? ucfirst(str_replace('_', ' ', $this->changeRequest->request_type)),
                'adminUrl' => url('/admin/mls-change-requests'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
