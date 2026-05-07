pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }

        success {
            withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_WEBHOOK')]) {
                bat '''
                curl -X POST -H "Content-type: application/json" ^
                --data "{\\"text\\":\\"✅ Jenkins Build SUCCESS - Playwright Tests Passed 🚀\\"}" ^
                %SLACK_WEBHOOK%
                '''
            }
        }

        failure {
            withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_WEBHOOK')]) {
                bat '''
                curl -X POST -H "Content-type: application/json" ^
                --data "{\\"text\\":\\"❌ Jenkins Build FAILED 🚨\\"}" ^
                %SLACK_WEBHOOK%
                '''
            }
        }
    }
}