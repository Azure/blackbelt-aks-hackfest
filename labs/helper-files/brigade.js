const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {
    
    // setup variables
    var gitPayload = JSON.parse(brigadeEvent.payload)
    var brigConfig = new Map()
    brigConfig.set("acrServer", project.secrets.acrServer)
    brigConfig.set("acrUsername", project.secrets.acrUsername)
    brigConfig.set("acrPassword", project.secrets.acrPassword)
    brigConfig.set("webImage", "azureworkshop/rating-web")
    brigConfig.set("gitSHA", brigadeEvent.commit.substr(0,7))
    brigConfig.set("eventType", brigadeEvent.type)
    brigConfig.set("branch", getBranch(gitPayload))
    brigConfig.set("imageTag", `${brigConfig.get("branch")}-${brigConfig.get("gitSHA")}`)
    brigConfig.set("webACRImage", `${brigConfig.get("acrServer")}/${brigConfig.get("webImage")}`)
    
    console.log(`==> gitHub webook (${brigConfig.get("branch")}) with commit ID ${brigConfig.get("gitSHA")}`)
    
    // setup brigade jobs
    var docker = new Job("job-runner-docker")
    var k8s = new Job("job-runner-k8s")
    dockerJobRunner(brigConfig, docker)
    kubeJobRunner(brigConfig, k8s)
    
    // start pipeline
    console.log(`==> starting pipeline for docker image: ${brigConfig.get("webACRImage")}:${brigConfig.get("imageTag")}`)
    
    var pipeline = new Group()
    pipeline.add(docker)
    pipeline.add(k8s)
    if (brigConfig.get("branch") == "master") {
        pipeline.runEach()
    } else {
        console.log(`==> no jobs to run when not master`)
    }  
})

events.on("after", (event, proj) => {
    console.log("brigade pipeline finished successfully")    
})

function dockerJobRunner(config, d) {
    d.storage.enabled = false
    d.image = "chzbrgr71/dockernd:node"
    d.privileged = true
    d.tasks = [
        "dockerd-entrypoint.sh &",
        "echo waiting && sleep 20",
        "cd /src/app/web",
        `docker login ${config.get("acrServer")} -u ${config.get("acrUsername")} -p ${config.get("acrPassword")}`,
        `docker build --build-arg BUILD_DATE='1/1/2017 5:00' --build-arg IMAGE_TAG_REF=${config.get("imageTag")} --build-arg VCS_REF=${config.get("gitSHA")} -t ${config.get("webImage")} .`,
        `docker tag ${config.get("webImage")} ${config.get("webACRImage")}:${config.get("imageTag")}`,
        `docker push ${config.get("webACRImage")}:${config.get("imageTag")}`,
        "killall dockerd"
    ]
}

function kubeJobRunner (config, k) {
    k.storage.enabled = false
    k.image = "lachlanevenson/k8s-kubectl:v1.8.2"
    k.tasks = [
        `kubectl set image deployment/heroes-web-deploy heroes-web-cntnr=<youracrhere>.azurecr.io/azureworkshop/rating-web:${config.get("imageTag")}`
    ]
}

function getBranch (p) {
    if (p.ref) {
        return p.ref.substring(11)
    } else {
        return "PR"
    }
}