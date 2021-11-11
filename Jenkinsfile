//以下需要修改
//抄送给
def mailcc = '874164121@qq.com'
//邮件接收人
def mailto = '594295220@qq.com'

//dockerTag， 每次发准生产都要修改
def dockerTag = "v1.22.0-build-160957"

//准生产空间名, 默认测试跟准生产的区别在于有没有-dev
def spaceName = "sp-front"

//k8s上的服务名
def k8sServerName = "ucweb"



//docker镜像名
def dockerImageName = "dockerdev.51zcm.cc/sp-mate/${k8sServerName}"


//打包docker 命令, 各自项目各自修改
//命令需要做到， 打包成docker, 并push到docker仓库上去
def getBuildCmd = {

  def cmd = '''
  npm install
  npm run build
  rm -rf docker/dist
  mv dist docker/dist
  '''
  return cmd+"cd docker && chmod +x build && ./build ${dockerTag}"
}
//以上需要修改
////////////////////////////////////////////////
//////////////////////////////////////////////
//构建环境(会按git分支自动适配)
def targetEnv = "sp-dev";


//部署命令
//只是简单的把指定空间下， 指定服务名的， pod干掉， 然后k8s的保障机制会自动重新创建pod
//测试跟准生产的镜像拉取策略是总是拉取， 就达到了更新效果
//准生产是有打tag的， 需要事先让对应环境管理人员， 预先设置好镜像tag
def getDeployCmd = {
  return "kubectl set image Deployment/${k8sServerName} ${k8sServerName}=${dockerImageName}:${dockerTag}  -n ${spaceName} && " + '''
kubectl get pods -n '''+spaceName+''' |grep '''+k8sServerName+''' | awk '{print "kubectl delete pods " $1 " -n '''+spaceName+'''" | "/bin/sh"}'
'''
}

//发送邮件
def sendMail = {
  body, subject ->
  mail bcc: '', body: "环境:${targetEnv} 镜像:${k8sServerName}:${dockerTag}  ${body}", cc: mailcc, from: '582981557@qq.com', subject: "${subject} 环境:${targetEnv} 镜像:${k8sServerName}:${dockerTag} ", to: mailto
}

//获取K8s机器的连接参数， 以便部署
def getK8sHost(){
		def remote = [:]
		remote.name = 'dbnode-002'
		remote.host = '192.168.1.202'
		remote.port = 22
		remote.allowAnyHosts = true
		return remote
}
//////////////////////////////////////////////
pipeline {
  agent any

  stages {


    stage('静态代码分析') {
      steps{
        script {
          // requires SonarQube Scanner 2.8+
          def scannerHome = tool 'sonar-scanner-3.3';
          withSonarQubeEnv('sonar') {
          sh "${scannerHome}/bin/sonar-scanner"
          }
        }
      }
    }

    stage("pre-build") {
      //预处理
      steps{
        script {

          if(env.GIT_BRANCH == 'origin/develop'){
            targetEnv = "sp-test";
          }

          //非准生产， 则镜像没有tag
          if(targetEnv != "sp-test"){
            dockerTag = "latest"
            spaceName = spaceName + "-dev"
          }
          echo "${env.GIT_BRANCH}分支变动 开始构建${k8sServerName}:${dockerTag}部署到 ${targetEnv}";

        }
      }
    }

    stage("build") {

      //构建
      steps{
        echo "build and package docker ${k8sServerName}:${dockerTag}";

        script {

          def buildCmd = ""

          try {

            buildCmd = getBuildCmd()
            sh buildCmd

          } catch (err) {
            currentBuild.result = "FAILURE"
            sendMail("构建失败,命令${buildCmd}", "构建失败")
            throw err
          }
        }
      }
    }

    //部署
    stage('deploy') {

      steps{
        echo "部署 ${k8sServerName}:${dockerTag} 服务";
        script{

          def deployCmd = ""

          try {
            deployCmd = getDeployCmd()
            def remote = getK8sHost();

            //获取k8s机器的账号密码
            withCredentials([usernamePassword(credentialsId: 'dbnode002', passwordVariable: 'password', usernameVariable: 'userName')]){
              remote.user = userName;
              remote.password = password;
            }
            //部署
            sshCommand remote: remote, command:  deployCmd

            currentBuild.result = "SUCCESS"
            sendMail("部署成功, 命令:${deployCmd}", "部署成功")
          } catch (err) {
            currentBuild.result = "FAILURE"
            sendMail("部署失败, 命令:${deployCmd}", "部署失败")
            throw err
          }
        }
      }
    }
  }
}






