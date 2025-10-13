pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'aeloo'
        DOCKERHUB_REPO = 'react-app'
        IMAGE_NAME = "${DOCKERHUB_USER}/${DOCKERHUB_REPO}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ael-amin/cicd-k8s-react.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME:latest .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh 'docker push $IMAGE_NAME:latest'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh '''
                    kubectl set image deployment/react-deployment react-container=$IMAGE_NAME:latest --record || true
                    kubectl rollout restart deployment/react-deployment || true
                    '''
                }
            }
        }
    }
}
