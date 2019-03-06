# raspberry pi setup via ansible

## pre-reqs
Roles from ansible galaxy need to be installed before running any playbooks.
> Command: `ansible-galaxy install -r requirements.yml`

## hosts
The file host.yml contains the ip address, port, and username of the raspberry host.  When running any ansible playbook commands, you'll need to include -k to get prompted for the password of the username.  Consider using [private key files](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#list-of-behavioral-inventory-parameters) so no password is needed, but that configuration is not part of this project.

[SSH Config](https://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/)

## playbooks
* `setup.playbook.yml`
  * sets the hostname, updates packages, and installs dependencies
  * maybe push dist & create app service???
* `deploy.playbook.yml`
  * stops the app
  * pushes the dist directory to the host
  * starts the app
