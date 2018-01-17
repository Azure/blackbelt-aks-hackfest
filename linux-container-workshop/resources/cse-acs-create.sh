
JUMP_VM_FQDN=${1}
adminUsername=${2}
adminPassword=${3}
RG_NAME=${4}
SP_NAME=${7}
SP_SECRET=${8}
AZ_USER_NAME=${5}
AZ_USER_PASSWORD=${6}

VM_SIZE='Standard_D2_v2_Promo'
TENANT_ID='12c5db39-b62e-4301-b848-09acda2692a5'
ACS_NAME=$adminUsername
DNS_PREFIX=$adminUsername
ADMIN_NAME=$adminUsername
JUMP_VM_USER_NAME=$adminUsername
JUMP_VM_USER_PASSWORD=$adminPassword

SSH_KEY_PATH='~/.ssh/id_rsa.pub'
AGENT_OS_DISK=120
MASTER_OS_DISK=50

echo "\n"
echo RG_NAME=$RG_NAME >> /home/$adminUsername/acs-create.sh
echo ACS_NAME=$adminUsername >> /home/$adminUsername/acs-create.sh 
echo SSH_KEY_PATH='~/.ssh/id_rsa.pub' >> /home/$adminUsername/acs-create.sh 
echo MASTER_OS_DISK=50 >> /home/$adminUsername/acs-create.sh 
echo AGENT_OS_DISK=120 >> /home/$adminUsername/acs-create.sh 
echo SP_NAME=$SP_NAME >> /home/$adminUsername/acs-create.sh
echo SP_SECRET=$SP_SECRET >> /home/$adminUsername/acs-create.sh
echo DNS_PREFIX=$adminUsername >> /home/$adminUsername/acs-create.sh
echo VM_SIZE=$VM_SIZE >> /home/$adminUsername/acs-create.sh
echo ADMIN_NAME=$adminUsername >> /home/$adminUsername/acs-create.sh
echo TENANT_ID='12c5db39-b62e-4301-b848-09acda2692a5' >> /home/$adminUsername/acs-create.sh


echo "\n"
echo az login --service-principal -u $SP_NAME -p $SP_SECRET --tenant $TENANT_ID >> /home/$adminUsername/acs-create.sh
echo "\n"
echo az acs create --orchestrator-type Kubernetes -g $RG_NAME -n $ACS_NAME  \
--ssh-key-value $SSH_KEY_PATH --service-principal $SP_NAME --client-secret  \
$SP_SECRET --dns-prefix $DNS_PREFIX --master-count 1 --master-vm-size \
$VM_SIZE --master-storage-profile ManagedDisks --master-osdisk-size \
$MASTER_OS_DISK --agent-count 2 --agent-vm-size $VM_SIZE \
--agent-storage-profile ManagedDisks --agent-osdisk-size $AGENT_OS_DISK \
--admin-username $ADMIN_NAME --generate-ssh-keys >> /home/$adminUsername/acs-create.sh
echo "\n"
echo az logout >> /home/$adminUsername/acs-create.sh

chown $adminUsername /home/$adminUsername/acs-create.sh

chmod +x /home/$adminUsername/acs-create.sh

sudo -u $adminUsername /home/$adminUsername/acs-create.sh

echo AZ_USER_NAME=$AZ_USER_NAME >> /home/$adminUsername/credentials.txt
echo AZ_USER_PASSWORD=$AZ_USER_PASSWORD >> /home/$adminUsername/credentials.txt
echo JUMP_VM_FQDN=$JUMP_VM_FQDN >> /home/$adminUsername/credentials.txt
echo JUMP_VM_USER_NAME=$JUMP_VM_USER_NAME >> /home/$adminUsername/credentials.txt
echo JUMP_VM_USER_PASSWORD=$JUMP_VM_USER_PASSWORD >> /home/$adminUsername/credentials.txt
echo GUIDE_URL=https://github.com/chzbrgr71/container-hackfest >> /home/$adminUsername/credentials.txt

yum -y install novnc python-websockify numpy tigervnc-server
wget --quiet --no-check-certificate -P /etc/systemd/system https://wolverine.itscloudy.af/liftshift/websockify.service
wget --quiet --no-check-certificate -P /etc/systemd/system "https://wolverine.itscloudy.af/liftshift/vncserver@:4.service"
openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/pki/tls/certs/novnc.pem -out /etc/pki/tls/certs/novnc.pem -days 365 -subj "/C=US/ST=Michigan/L=Ann Arbor/O=Lift And Shift/OU=Lift And Shift/CN=stkirk.cloud"
su -c "mkdir .vnc" - $adminUsername
wget --quiet --no-check-certificate -P /home/$adminUsername/.vnc https://wolverine.itscloudy.af/liftshift/passwd
chown $adminUsername:$adminUsername /home/$adminUsername/.vnc/passwd
chmod 600 /home/$adminUsername/.vnc/passwd
iptables -I INPUT 1 -m tcp -p tcp --dport 6080 -j ACCEPT
service iptables save
systemctl daemon-reload
systemctl enable vncserver@:4.service
systemctl enable websockify.service
systemctl start vncserver@:4.service
systemctl start websockify.service

# Enable Copy/Paste to RDP
yum groups install "server with gui" -y
yum install epel-release -y
yum install xrdp -y
systemctl enable xrdp
systemctl start xrdp

# Add User to docker group
groupadd docker
gpasswd -a $JUMP_VM_USER_NAME docker
newgrp docker
systemctl restart docker
