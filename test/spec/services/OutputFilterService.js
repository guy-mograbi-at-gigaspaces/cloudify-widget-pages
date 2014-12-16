'use strict';

describe('Service: Outputfilterservice', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mOutputFilterService;
    beforeEach(inject(function (OutputFilterService) {
        mOutputFilterService = OutputFilterService;
    }));

    it('should do something', function () {
        expect(!!mOutputFilterService).toBe(true);
    });



    it('should remove socket timeout exception strings', function () {
        var result = mOutputFilterService.filter(socketTimeoutOutput);
        var found = _.find(result, function (item) {
            if ( item.indexOf('an exception during authentication') >= 0  || item.indexOf('java.net.SocketTimeoutException: Read timed out') >= 0 ) {
                return item;
            }
        });
        expect(found).toBe(undefined);

        // so far we validated that 'SocketTimeout' does not appear, but lets validate lines after that do appear
        var afterLines = _.find(result, function(item){
            if ( item.indexOf('Running script') >= 0){
                return item;
            }
        });

        expect(afterLines!==undefined).toBe(true);
    });




    var socketTimeoutOutput = ['Starting Non-Interactive Shell',
        '>>> bootstrap-cloud -timeout 120000 --verbose ec2ibm_blu_1417597103260',
        '   Setting security profile to "nonsecure".  ',
        '   Bootstrapping cloud ec2ibm_blu_1417597103260. This may take a few minutes.',
        '   Validating Cloudify URL "http://repository.cloudifysource.org/org/cloudifysource/2.7.1-6210-RELEASE/gigaspaces-cloudify-2.7.1-ga-b6210.tar.gz" [OK]   ',
        '   Establishing connection with provider aws-ec2.',
        '   Established connection with provider aws-ec2. ',
        '   Starting validation of cloud configuration',
        '   Validating provider name "aws-ec2" [OK]   ',
        '   Validating all templates  ',
        '   Starting validation of template "BLU_EC2" ',
        '   Validating cloud API credentials [OK] ',
        '   Validating image "us-east-1/ami-3a824d52" and hardware "m3.2xlarge" for location "us-east-1" [OK] ',
        '   Validating security group "yohana-dev" [OK]   ',
        '   Validating key pair "cloudify-widget-1417597103267" [OK]  ',
        '   Template "BLU_EC2" validated [OK] ',
        '   Cloud configuration validation completed  ',
        '   Retrieving existing management machines with prefix blusolomanager-1417597014860  ',
        '   Attempting Cloudify Management VM provisioning.   ',
        '   Starting a new machine with prefix blusolomanager-14175970148601. This may take a few minutes.',
        '   Waiting for blusolomanager-14175970148601 to become available ',
        '   New machine is allocated, name : blusolomanager-14175970148601-5f17a5b3. Public IP : [54.172.239.33]  ',
        '   Management started successfully.  ',
        '   Attempting to access Management VM 54.172.239.33. ',
        '   Uploading files to 54.172.239.33. ',
        '   Using "/tmp/vfs_cache" as temporary files store.  ',
        '   Permanently added "54.172.239.33" (RSA) to the list of known hosts.   ',
        '   an exception during authentication',
        '   java.net.SocketTimeoutException: Read timed out   ',
        '   an exception during authentication',
        '   java.net.SocketTimeoutException: Read timed out   ',
        '   an exception during authentication',
        '   java.net.SocketTimeoutException: Read timed out   ',
        '   Launching agent on 54.172.239.33. ',
        '   Connecting to 54.172.239.33:22',
        '   Permanently added "54.172.239.33" (RSA) to the list of known hosts.   ',
        '   [54.172.239.33] Loading Cloudify Environment  ',
        '   [54.172.239.33] script path is /root/gs-files/upload  ',
        '   [54.172.239.33] CLOUDIFY_OPEN_FILES_LIMIT is  ',
        '   [54.172.239.33] Standard bootstrap process will be used   ',
        '   [54.172.239.33] Running script /root/gs-files/upload/pre-bootstrap.sh ',
        '   [54.172.239.33] iptables: Flushing firewall rules: [  OK  ]   ',
        '   [54.172.239.33] iptables: Setting chains to policy ACCEPT: [  OK  ]   ',
        '   [54.172.239.33] iptables: Unloading modules:   [  OK  ]   ',
        '   [54.172.239.33] Machine Architecture -- x86_64',
        '   [54.172.239.33] Previous JAVA_HOME value --   ',
        '   [54.172.239.33] Downloading JDK from http://repository.cloudifysource.org/com/oracle/java/1.6.0_32/jdk-6u32-linux-x64.bin ',
        '   [54.172.239.33] Installing JDK',
        '   [54.172.239.33] Downloading cloudify installation from http://repository.cloudifysource.org/org/cloudifysource/2.7.1-6210-RELEASE/gigaspaces-cloudify-2.7.1-ga-b6210.tar.gz'  ,
        '   [54.172.239.33] Updating environment script   ',
        '   [54.172.239.33] Running as root   ',
        '   [54.172.239.33] Setting privileged mode   ',
        '   [54.172.239.33] no crontab for root   ',
        '  [54.172.239.33]',
        '   [54.172.239.33] Starting Non-Interactive Shell',
        '   -cloud.groovy ] >>> start-management -timeout 30 --verbose -cloud-file /root/gs-files/ec2ibm_blu  ',
        '   [54.172.239.33] NIC Address=172.31.15.16  ',
        '   [54.172.239.33] Lookup Locators=172.31.15.16:4174 ',
        '   [54.172.239.33] Lookup Groups=gigaspaces-Cloudify-2.7.1-ga',
        '   [54.172.239.33] ..',
        '   [54.172.239.33] Starting agent and management processes:  ',
        '   [54.172.239.33] nohup gs-agent.sh gsa.global.lus 0 gsa.lus 1 gsa.gsc 0 gsa.global.gsm 0 gsa.gsm 1 gsa.global.esm 1 >/dev/null 2>&1',
        '   [54.172.239.33] STARTING CLOUDIFY MANAGEMENT  ',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Discovered agent nic-address=172.31.15.16 lookup-groups=gigaspaces-Cloudify-2.7.1-ga. ',
        '   [54.172.239.33] Detected LUS management process started by agent 72ff3325-9d0a-4790-8b13-5882f84c02bc ',
        '   [54.172.239.33] Detected GSM management process started by agent 72ff3325-9d0a-4790-8b13-5882f84c02bc ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] Waiting for Elastic Service Manager   ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Waiting for Elastic Service Manager   ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Waiting for Elastic Service Manager   ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Waiting for Elastic Service Manager   ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Waiting for Elastic Service Manager   ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Waiting for Elastic Service Manager   ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] Writing cloud configuration to space. ',
        '   [54.172.239.33] STARTING CLOUDIFY WEBUI   ',
        '   [54.172.239.33] ...   ',
        '   [54.172.239.33] STARTING CLOUDIFY REST',
        '   [54.172.239.33] CLOUDIFY LOCAL-CLOUD STARTED  ',
        '   [54.172.239.33]   ',
        '   [54.172.239.33] LOCAL-CLOUD INFO :',
        '   [54.172.239.33]         CLOUDIFY MANAGEMENT	http://172.31.15.16:8099/  ',
        '   [54.172.239.33]         CLOUDIFY GATEWAY	http://172.31.15.16:8100/  ',
        '   [54.172.239.33] Lookup Locators=172.31.15.16:4174 ',
        '   [54.172.239.33] Lookup Groups=gigaspaces-Cloudify-2.7.1-ga',
        '   [54.172.239.33] . ',
        '   [54.172.239.33] Discovered agent nic-address=172.31.15.16 lookup-groups=gigaspaces-Cloudify-2.7.1-ga. ',
        '   [54.172.239.33] Detected LUS management process started by agent 72ff3325-9d0a-4790-8b13-5882f84c02bc ',
        '   [54.172.239.33] Detected GSM management process started by agent 72ff3325-9d0a-4790-8b13-5882f84c02bc ',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] Waiting for Management processes to start.',
        '   [54.172.239.33] Management started successfully. Use the shutdown-management command to shutdown management processes running on local machine.   ',
        '   [54.172.239.33] >>> exit  ',
        '   [54.172.239.33] Good Bye! ',
        '   [54.172.239.33]   ',
        '   Established connection with Management VM 54.172.239.33.  ',
        '   Rest service is available at: http://54.172.239.33:8100.  ',
        '   Webui service is available at: http://54.172.239.33:8099. ',
        '   Successfully created Cloudify Manager on provider ec2ibm_blu_1417597103260. Use the "teardown-cloud ec2ibm_blu_1417597103260" command to terminate all machines.  ',
        '   >>> exit  ',
        '   Good Bye! ',
        ' ',
        '   ignore: CLOUDIFY_HOME is /usr/lib/cloudify-widget/cloudify-folder ',
        ' ',
        '   Starting Non-Interactive Shell',
        '   >>> connect http://54.172.239.33:8100 ',
        '   Connected successfully',
        '   9/solo/apps/blustratus-chef/blustratus-single y-widget/recipes/copy-141759763408  ',
        '   packing folder /tmp/cloudify-widget/recipes/copy-1417597634089/solo/apps/blustratus-chef/blustratus-single',
        '   created /tmp/ServicePackage4218307988089941638.tmp/blustratus.zip ',
        '   Uploading /tmp/ServicePackage4218307988089941638.tmp/blustratus.zip   ',
        '   Installing service blustratus with 1 instances',
        '   Waiting for life cycle events of service blustratus   ',
        '   ......',
        '   [ip-172-31-15-16.ec2.internal/172.31.15.16] - blustratus-1 PRE_START invoked  ',
        '   [ip-172-31-15-16.ec2.internal/172.31.15.16] - blustratus-1 PRE_START completed, duration: 0.0 seconds [OK]',
        '   [ip-172-31-15-16.ec2.internal/172.31.15.16] - blustratus-1 START invoked  ',
        '   ..',
        '   Successfully installed 1 instances out of 1 for service blustratus',
        ' ',
        ' ',
        '   Service "blustratus" successfully installed   ',
        '   >>> exit  ',
        '   Good Bye! ' ];

});
