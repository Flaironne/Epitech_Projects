<?php

namespace App\Listeners;

use App\Events\JobApplicationSubmittedEvent;
use App\Mail\JobApplicationSubmittedApplicantMail;
use App\Mail\JobApplicationSubmittedMail;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class SendJobApplicationEmailListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(JobApplicationSubmittedEvent $event): void
    {
        $jobApplication = $event->jobApplication;

        $description = "A new job application has been submitted for the job {$jobApplication->job->label}";
        if ($jobApplication->user_id !== null) {
            $description .= " by {$jobApplication->user->firstname} {$jobApplication->user->lastname}";
        } else {
            $description .= " by {$jobApplication->firstname} {$jobApplication->lastname}";
        }

        Notification::create([
            "label" => "New job application submitted",
            "description" => $description,
            "job_application_id" => $jobApplication->id,
            "user_id" => $jobApplication->job->user_id
        ]);

        $owner = $jobApplication->job->user;
        $job = $jobApplication->job;
        
        // If the job application has been submitted by a user, we use the user's information
        $applicant = $jobApplication->user_id !== null ? $jobApplication->user : new User([
            "firstname" => $jobApplication->firstname,
            "lastname" => $jobApplication->lastname,
            "email" => $jobApplication->email,
            "phone" => $jobApplication->phone
        ]);

        /**
         * Send email to owner and applicant to notify them that a new job application has been submitted
         */
        Mail::to($owner->email, "{$owner->firstname} {$owner->lastname}")->send(new JobApplicationSubmittedMail($owner, $applicant, $job));
        Mail::to($applicant->email, "{$applicant->firstname} {$applicant->lastname}")->send(new JobApplicationSubmittedApplicantMail($applicant, $job));
    }
}
