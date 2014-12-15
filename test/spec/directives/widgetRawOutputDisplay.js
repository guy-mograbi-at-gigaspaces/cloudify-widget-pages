'use strict';

describe('Directive: widgetRawOutputDisplay', function () {

    // load the directive's module
    beforeEach(module('ibmBiginsightsUiApp', 'directives-templates'));

    var element,
        scope;


    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should change put elements on page when calling stop', inject(function ($rootScope, $compile) {
        scope.guy = 'this is the widgetRawOutputDisplay directive';
        scope.source = {
            widgetStatus: { state: 'STOPPED' }
        };

        var stopInvoked = false;
        scope.onStop = function () {
            stopInvoked = true;
        };


        element = angular.element('<div widget-raw-output-display="source" stop="onStop()"></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        var isolateScope = element.children().scope();
        expect(typeof(isolateScope.callStop)).toBe('function');
        expect(typeof(isolateScope.page)).toBe('object');

        isolateScope.callStop();
        $rootScope.$digest();

        expect(isolateScope.page.stopping).toBe(true);
        expect(isolateScope.page.showSomethingIsWrong).toBe(false);
        expect(stopInvoked).toBe(true);

    }));

    it('should set page.stopped false if status changes', inject(function ($compile, $rootScope) {
        scope.guy = 'this is the widgetRawOutputDisplay directive';
        scope.source = {
            widgetStatus: { state: 'STOPPED' }
        };

        var stopInvoked = false;
        scope.onStop = function () {
            stopInvoked = true;
        };


        element = angular.element('<div widget-raw-output-display="source" ></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        var isolateScope = element.children().scope();
        isolateScope.page.stopping = true;
        $rootScope.$digest();

        scope.source.widgetStatus.state = 'GUY';
        $rootScope.$digest();
        expect(isolateScope.page.stopping).toBe(false);
    }));


    var errorExample = ['', 'Starting Non-Interactive Shell',
        '>>> bootstrap-cloud -timeout 120000 --verbose ec2ibm_blu_1415814188915 ',
        'Setting security profile to \'nonsecure\'.',
        'Bootstrapping cloud ec2ibm_blu_1415814188915. This may take a few minutes.',
        'Validating Cloudify URL \'http://repository.cloudifysource.org/org/cloudifysource/2.7.1-6210-RELEASE/gigaspaces-cloudify-2.7.1-ga-b6210.tar.gz\' [OK]',
        'Establishing connection with provider aws-ec2.',
        'Established connection with provider aws-ec2.',
        'Starting validation of cloud configuration',
        'Validating provider name \'aws-ec2\' [OK]',
        'Validating all templates',
        'Starting validation of template \'BLU_EC2\'',
        'Validating cloud API credentials [OK]',
        'Validating image \'us-east-1/ami-3a824d52\' and hardware \'m3.2xlarge\' for location \'us-east-1\' [OK]',
        'Validating security group \'default\' [OK]',
        'Validating key pair \'cloudify-widget-1415814188923\' [OK]',
        'Template \'BLU_EC2\' validated [OK]',
        'Cloud configuration validation completed',
        'Retrieving existing management machines with prefix blusolomanager-1415814119677',
        'Attempting Cloudify Management VM provisioning.',
        'Starting a new machine with prefix blusolomanager-14158141196771. This may take a few minutes.',
        'Failed to create Cloudify Management VM: Error org.jclouds.rest.AuthorizationException: POST https://ec2.us-east-1.amazonaws.com/ HTTP/1.1 -> HTTP/1.1 401 Unauthorized.',
        'Failed to start a management machine: Operation failed. java.util.concurrent.ExecutionException: org.jclouds.rest.AuthorizationException: POST https://ec2.us-east-1.amazonaws.com/ HTTP/1.1 -> HTTP/1.1 401 Unauthorized',
        '	at java.util.concurrent.FutureTask$Sync.innerGet(FutureTask.java:232)',
        '	at java.util.concurrent.FutureTask.get(FutureTask.java:91)',
        '	at org.cloudifysource.esc.driver.provisioning.BaseProvisioningDriver.doStartManagementMachines(BaseProvisioningDriver.java:331)',
        '	at org.cloudifysource.esc.driver.provisioning.jclouds.DefaultProvisioningDriver.startManagementMachines(DefaultProvisioningDriver.java:427)',
        '	at org.cloudifysource.esc.shell.installer.CloudGridAgentBootstrapper.createManagementServers(CloudGridAgentBootstrapper.java:344)',
        '	at org.cloudifysource.esc.shell.installer.CloudGridAgentBootstrapper.getOrCreateManagementServers(CloudGridAgentBootstrapper.java:291)',
        '	at org.cloudifysource.esc.shell.installer.CloudGridAgentBootstrapper.bootstrapCloudAndWait(CloudGridAgentBootstrapper.java:216)',
        '	at org.cloudifysource.esc.shell.commands.BootstrapCloud.doExecute(BootstrapCloud.java:223)',
        '	at org.cloudifysource.shell.commands.AbstractGSCommand.execute(AbstractGSCommand.java:103)',
        '	at org.apache.felix.gogo.commands.basic.AbstractCommand.execute(AbstractCommand.java:35)',
        '	at org.apache.felix.gogo.runtime.Closure.executeCmd(Closure.java:474)',
        '	at org.apache.felix.gogo.runtime.Closure.executeStatement(Closure.java:400)',
        '	at org.apache.felix.gogo.runtime.Pipe.run(Pipe.java:108)',
        '	at org.apache.felix.gogo.runtime.Closure.execute(Closure.java:183)',
        '	at org.apache.felix.gogo.runtime.Closure.execute(Closure.java:120)',
        '	at org.apache.felix.gogo.runtime.CommandSessionImpl.execute(CommandSessionImpl.java:89)',
        '	at org.apache.karaf.shell.console.jline.Console.run(Console.java:172)',
        '	at org.apache.karaf.shell.console.Main.run(Main.java:191)',
        '	at org.apache.karaf.shell.console.Main.run(Main.java:89)',
        '	at org.cloudifysource.shell.GigaShellMain.main(GigaShellMain.java:126)',
        'Caused by: org.jclouds.rest.AuthorizationException: POST https://ec2.us-east-1.amazonaws.com/ HTTP/1.1 -> HTTP/1.1 401 Unauthorized',
        '	at org.jclouds.aws.handlers.ParseAWSErrorFromXmlContent.refineException(ParseAWSErrorFromXmlContent.java:123)',
        '	at org.jclouds.aws.handlers.ParseAWSErrorFromXmlContent.handleError(ParseAWSErrorFromXmlContent.java:90)',
        '	at org.jclouds.http.handlers.DelegatingErrorHandler.handleError(DelegatingErrorHandler.java:67)',
        '	at org.jclouds.http.internal.BaseHttpCommandExecutorService.shouldContinue(BaseHttpCommandExecutorService.java:180)',
        '	at org.jclouds.http.internal.BaseHttpCommandExecutorService.invoke(BaseHttpCommandExecutorService.java:150)',
        '	at org.jclouds.rest.internal.InvokeSyncToAsyncHttpMethod.invoke(InvokeSyncToAsyncHttpMethod.java:131)',
        '	at org.jclouds.rest.internal.InvokeSyncToAsyncHttpMethod.apply(InvokeSyncToAsyncHttpMethod.java:97)',
        '	at org.jclouds.rest.internal.InvokeSyncToAsyncHttpMethod.apply(InvokeSyncToAsyncHttpMethod.java:58)',
        '	at org.jclouds.reflect.FunctionalReflection$FunctionalInvocationHandler.handleInvocation(FunctionalReflection.java:117)',
        '	at com.google.common.reflect.AbstractInvocationHandler.invoke(AbstractInvocationHandler.java:70)',
        '	at $Proxy67.runInstancesInRegion(Unknown Source)',
        '	at org.jclouds.ec2.compute.strategy.EC2CreateNodesInGroupThenAddToSet.createNodesInRegionAndZone(EC2CreateNodesInGroupThenAddToSet.java:232)',
        '	at org.jclouds.aws.ec2.compute.strategy.AWSEC2CreateNodesInGroupThenAddToSet.createNodesInRegionAndZone(AWSEC2CreateNodesInGroupThenAddToSet.java:109)',
        '	at org.jclouds.ec2.compute.strategy.EC2CreateNodesInGroupThenAddToSet.createKeyPairAndSecurityGroupsAsNeededThenRunInstances(EC2CreateNodesInGroupThenAddToSet.java:218)',
        '	at org.jclouds.ec2.compute.strategy.EC2CreateNodesInGroupThenAddToSet.runInstancesAndWarnOnInvisible(EC2CreateNodesInGroupThenAddToSet.java:154)',
        '	at org.jclouds.ec2.compute.strategy.EC2CreateNodesInGroupThenAddToSet.execute(EC2CreateNodesInGroupThenAddToSet.java:135)',
        '	at org.jclouds.compute.internal.BaseComputeService.createNodesInGroup(BaseComputeService.java:212)',
        '	at org.jclouds.ec2.compute.EC2ComputeService.createNodesInGroup(EC2ComputeService.java:147)',
        '	at org.cloudifysource.esc.jclouds.JCloudsDeployer.createServersWithRetry(JCloudsDeployer.java:824)',
        '	at org.cloudifysource.esc.jclouds.JCloudsDeployer.createServer(JCloudsDeployer.java:174)',
        '	at org.cloudifysource.esc.driver.provisioning.jclouds.DefaultProvisioningDriver.createServer(DefaultProvisioningDriver.java:260)',
        '	at org.cloudifysource.esc.driver.provisioning.jclouds.DefaultProvisioningDriver.createServer(DefaultProvisioningDriver.java:236)',
        '	at org.cloudifysource.esc.driver.provisioning.BaseProvisioningDriver$1.call(BaseProvisioningDriver.java:319)',
        '	at org.cloudifysource.esc.driver.provisioning.BaseProvisioningDriver$1.call(BaseProvisioningDriver.java:314)',
        '	at java.util.concurrent.FutureTask$Sync.innerRun(FutureTask.java:303)',
        '	at java.util.concurrent.FutureTask.run(FutureTask.java:138)',
        '	at java.util.concurrent.ThreadPoolExecutor$Worker.runTask(ThreadPoolExecutor.java:886)',
        '	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:908)',
        '	at java.lang.Thread.run(Thread.java:662)',
        'Caused by: org.jclouds.http.HttpResponseException: request: POST https://ec2.us-east-1.amazonaws.com/ HTTP/1.1  [Action=RunInstances&ImageId=ami-3a824d52&InstanceType=m3.2xlarge&KeyName=cloudify-widget-1415814188923&MaxCount=1&MinCount=1&SecurityGroup.1=jclouds%23blusolomanager-14158141196771&SecurityGroup.2=default&Signature=XNmBnXzVgqAhXpGiY9REpI2Eeezw/ZDY41WDZXETqxw%3D&SignatureMethod=HmacSHA256&SignatureVersion=2&Timestamp=2014-11-12T17%3A43%3A36.780Z&UserData=I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZ3JhZGU6IG5vbmUK&Version=2012-06-01&AWSAccessKeyId=AKIAIBTYJKCAU66HBQ5Q] failed with response: HTTP/1.1 401 Unauthorized',
        '	at org.jclouds.aws.handlers.ParseAWSErrorFromXmlContent.handleError(ParseAWSErrorFromXmlContent.java:64)',
        '	... 27 more',
        '',
        'Of the required 1 management machines, 1 failed to start.',
        'Error while accessing cloud : One or more managememnt machines failed. The first encountered error was: org.jclouds.rest.AuthorizationException: POST https://ec2.us-east-1.amazonaws.com/ HTTP/1.1 -> HTTP/1.1 401 Unauthorized'];


    it('should remove exceptions from output', inject(function ($compile, $rootScope, $timeout) {

        $rootScope.source = { };

        element = angular.element('<div widget-raw-output-display="source" ></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();

        var isolateScope = element.children().scope();
        $timeout.flush();   // fire watch expressions

        isolateScope.source = {  widgetStatus : { rawOutput : errorExample } } ;
        try{$timeout.flush();}catch(e){}
        try{$rootScope.$digest();}catch(e){}

        // we see that the output was decreased between 79 lines to 22.
        expect(isolateScope.digestedOutput.length).toBe(22);
    }));
});
