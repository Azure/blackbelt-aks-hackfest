JUMP_VM_FQDN=${1}
adminUsername=${2}
adminPassword=${3}
RG_NAME=${4}
SP_NAME=${7}
SP_SECRET=${8}
AZ_USER_NAME=${5}
AZ_USER_PASSWORD=${6}

JUMP_VM_USER_NAME=$adminUsername
JUMP_VM_USER_PASSWORD=$adminPassword

SSH_KEY_PATH='~/.ssh/id_rsa.pub'

echo "\n"

echo **** AZURE CREDENTIALS ***** >> /home/$adminUsername/credentials.txt
echo AZ_USER_NAME=$AZ_USER_NAME >> /home/$adminUsername/credentials.txt
echo AZ_USER_PASSWORD=$AZ_USER_PASSWORD >> /home/$adminUsername/credentials.txt
echo " " >> /home/$adminUsername/credentials.txt

echo **** VM INFO / USER / PASS / SSH CREDENTIALS ***** >> /home/$adminUsername/credentials.txt
echo JUMP_VM_FQDN=$JUMP_VM_FQDN >> /home/$adminUsername/credentials.txt
echo JUMP_VM_USER_NAME=$JUMP_VM_USER_NAME >> /home/$adminUsername/credentials.txt
echo JUMP_VM_USER_PASSWORD=$JUMP_VM_USER_PASSWORD >> /home/$adminUsername/credentials.txt
echo SERVICE_PRINCIPAL_USER=$SP_NAME >> /home/$adminUsername/credentials.txt
echo SERVICE_PRINCIPAL_SECRET=$SP_SECRET >> /home/$adminUsername/credentials.txt
echo " " >> /home/$adminUsername/credentials.txt

echo **** LAB GUIDE URL ***** >> /home/$adminUsername/credentials.txt
echo GUIDE_URL=https://github.com/azure/blackbelt-aks-hackfest/ >> /home/$adminUsername/credentials.txt

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
