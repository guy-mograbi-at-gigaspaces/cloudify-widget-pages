System tests flow
=================


 - all clouds
   - fill in form  with correct details
         - click play
         - follow output. assert no errors.
         - assert that buttons for instance are visible
      - fill in form  with missing details
         - see that form validation errors appear
         - do this for every field
      - fill in form  with error details
         - assert we show output view and then fail and go back to form with `error` notice.
   - assert running multiple times works - new instance each time

 - Softlayer


 - EC2
   - assert `private key` options are shown
   - assert security group validation. if security group does not contain the ports/ips we require, we fail with error notice.
