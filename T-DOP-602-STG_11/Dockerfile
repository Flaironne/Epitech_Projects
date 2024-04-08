FROM jenkins/jenkins:lts-jdk17

WORKDIR /var/jenkins_home

COPY ./my_marvin.yml ./casc_configs/my_marvin.yml
COPY ./job_dsl.groovy ./casc_configs/job_dsl.groovy

RUN jenkins-plugin-cli --plugins cloudbees-folder configuration-as-code credentials github instance-identity job-dsl script-security structs role-strategy ws-cleanup

ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs