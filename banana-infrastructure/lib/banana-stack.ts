import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class BananaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ALEX REQUIERMENTS
    // ✅ t3.medium
    // ✅ amazon linux 2023
    // ✅ config security group
    // pass in user data
    const defaultVpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      isDefault: true,
    });

    const ourSG = new ec2.SecurityGroup(this, 'MySecurityGroup3000', { vpc: defaultVpc })
    ourSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3000))

    const ourUserData = ec2.UserData.forLinux()
    ourUserData.addCommands(`
      sudo -u ec2-user -i << 'EOF'

      sudo yum update -y

      # Node.js
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
      source ~/.bashrc
      nvm install --lts

      # Docker
      sudo yum install -y docker
      sudo service docker start
      sudo usermod -a -G docker ec2-user

      # Git
      sudo yum install -y git

      # PostgreSQL
      sudo yum install -y postgresql15.x86_64

      # Database
      sudo docker run --name piko-db -p 5432:5432 -e POSTGRES_DB=piko-db -e POSTGRES_USER=piko -e POSTGRES_PASSWORD=pikopw -v piko-db:/var/lib/postgresql/data -d postgres

      # Wait for the database to be ready
      echo "Waiting for PostgreSQL to be ready..."
      until pg_isready -h localhost -p 5432 -U piko; do
        sleep 2
      done
      echo "PostgreSQL is ready!"

      # Cloning our repo
      git clone https://github.com/thomasp18/pickleball_weather_app
      cd pickleball_weather_app/

      # Initializing our database
      cd next-app/
      psql -Atx postgresql://piko:pikopw@localhost:5432/piko-db -f app/utils/seeder.sql

      # Creating our .env file
      echo "POSTGRES_DB=piko-db
      POSTGRES_USER=piko
      POSTGRES_PASSWORD=pikopw
      POSTGRES_HOST=localhost
      POSTGRES_PORT=5432" >> .env

      # Starting our app
      npm ci
      npm run build
      npm run start &

      EOF
      `)

    const bananaInstance = new ec2.Instance(this, "ourInstance", {
      vpc: defaultVpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
      securityGroup: ourSG,
      userData: ourUserData
    })
  }
}
