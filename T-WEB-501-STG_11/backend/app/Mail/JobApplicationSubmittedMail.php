<?php

namespace App\Mail;

use App\Models\Job;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $completeApplicantName;
    public string $completeOwnerName;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $owner,
        public User $applicant,
        public Job $job
    ) {
        $this->completeApplicantName = $applicant->firstname . ' ' . $applicant->lastname;
        $this->completeOwnerName = $owner->firstname . ' ' . $owner->lastname;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You have a new job application !',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.job-application-submitted',
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
