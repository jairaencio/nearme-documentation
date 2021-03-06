pipeline {
  agent any

  triggers {
    cron('H H/12 * * *')
  }

  environment {
    TOKEN = credentials('POS_TOKEN')
    EMAIL = "darek+ci@near-me.com"
  }

  options {
    disableConcurrentBuilds()
    timeout(time: 10, unit: 'MINUTES')
    buildDiscarder(logRotator(daysToKeepStr: '365', artifactDaysToKeepStr: '30'))
  }
  stages {
    stage('Staging') {
      environment {
        MP_URL = "https://documentation.staging-oregon.near-me.com"
      }

      when {
        branch 'master'
      }

      steps {
        slackSend (channel: "#notifications-docs", message: "STARTED: Deploying to <${MP_URL}|staging environment> (<${env.BUILD_URL}|Build #${env.BUILD_NUMBER}>)")

        sh 'bash -l ./scripts/build.sh'
        sh 'bash -l ./scripts/deploy.sh'
        sh 'bash -l ./scripts/test-e2e.sh'
      }

      post {
        success {
          slackSend (channel: "#notifications-docs", color: '#00FF00', message: "SUCCESS: Deployed new code to staging, tests passed. (<${MP_URL}|Preview staging>)")
        }

        failure {
          slackSend (channel: "#notifications-docs", color: '#FF0000', message: "FAILED: Build failed. Deploy or tests failed. (<${env.BUILD_URL}|Open build details>)")
        }
      }
    }
  }
}
