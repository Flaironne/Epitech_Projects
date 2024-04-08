@extends('emails.layouts.master')

@section('title', 'You received a new job application !')

@section('content')
    <div class="email-container">
        @include('emails.components.header', [
            'title' => 'You received a new job application !'
        ])
        <div class="email-body">
            <p>Hi {{ $job->user->firstname }},</p>
            <p>Someone has applied to your job offer <strong>{{ $job->label }}</strong> created on {{ $job->created_at->format('d/m/Y') }}.</p>
            <h4>Applicants details</h4>
            <ul>
                <li>{{ $completeApplicantName }}</li>
                <li>{{ $applicant->email }}</li>
                <li>{{ $applicant->phone }}</li>
            </ul>
            <p>
                <a href="{{ env('FRONT_URL') }}">Click here</a>  to be redirected to the website.
            </p>
        </div>
        @include('emails.components.footer')
    </div>
@endsection
