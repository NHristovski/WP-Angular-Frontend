pipeline {

  environment {
    registry = "nikolahristovski/generic-store"
    registryCredential = 'dockerhub'
    dockerImage = ''

  }
  agent any

  stages {

    stage('npm install') {
      steps {
        sh "/bin/npm install"
      }
    }

    stage('ng build') {
      steps {
        sh "/bin/ng build --prod"
      }
    }

    stage('Build docker images and push to dockerhub') {
      steps {
        sh '''
                    docker_username=nikolahristovski
                    cat /var/lib/jenkins/docker_password.txt | docker login --username $docker_username --password-stdin

                    image_name="${docker_username}/frontend:0.0.1"
                    echo "image name is $image_name"

                    if [[ "$(docker images -q $image_name 2> /dev/null)" != "" ]]; then
                       docker rmi $image_name
                    fi

                    docker build . -t 0.0.1
                    docker push $image_name
                '''
      }
    }
  }
}
