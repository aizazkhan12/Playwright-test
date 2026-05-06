pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.playwright-browsers"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                echo 'Setting up Node.js environment...'
                // If using nvm or a Node tool installer, configure it here.
                // For Jenkins with NodeJS plugin, use: tool name: 'NodeJS-18', type: 'NodeJSInstallation'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install --with-deps chromium firefox'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo 'Running Playwright E2E tests...'
                sh 'npm test -- --reporter=list,junit,html'
            }
            post {
                always {
                    // Publish JUnit XML test results
                    junit testResults: 'test-results/results.xml', allowEmptyResults: true
                }
            }
        }
    }

    post {
        always {
            echo 'Publishing Playwright HTML report...'
            publishHTML(target: [
                allowMissing         : true,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : 'Playwright Test Report'
            ])

            echo 'Archiving test artifacts...'
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }

        success {
            echo 'All Playwright tests passed!'
        }

        failure {
            echo 'Some Playwright tests failed. Check the HTML report for details.'
        }

        cleanup {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
