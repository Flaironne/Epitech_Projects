@extends('emails.layouts.master')

@section('title', 'We received your job application !')

@section('content')
    <div class="email-container">
        @include('emails.components.header', [
            'title' => 'We received your job application !',
        ])
        <div class="email-body">
            <p>Hi {{ $applicant->firstname }},</p>
            <p>
                You have successfully applied to the job <strong>{{ $job->label }}</strong> at <strong>{{ $job->company->label }}</strong>.
            </p>
            <p>
                <a href="{{ env('FRONT_URL') }}">Click here</a> to be redirected to the website.
            </p>
        </div>
        @include('emails.components.footer')
    </div>
@endsection
