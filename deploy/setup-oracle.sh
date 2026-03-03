#!/bin/bash
set -e

echo "=== Lord Lombo Ministries - Setup Oracle Cloud VM ==="
echo ""

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. Setup PostgreSQL
sudo -u postgres psql << 'SQL'
CREATE USER llm_user WITH PASSWORD 'LLM_Prod_2026!Secure';
CREATE DATABASE llm_production OWNER llm_user;
GRANT ALL PRIVILEGES ON DATABASE llm_production TO llm_user;
SQL

echo "PostgreSQL configured: llm_production / llm_user"

# 5. Install PM2 (process manager)
sudo npm install -g pm2

# 6. Install Nginx (reverse proxy)
sudo apt install -y nginx

# 7. Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx

# 8. Create app directory
sudo mkdir -p /opt/llm-api
sudo chown $USER:$USER /opt/llm-api

# 9. Firewall rules
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || true

echo ""
echo "=== Setup complete! ==="
echo "Next steps:"
echo "1. Clone repo: cd /opt/llm-api && git clone https://github.com/messiya26/Prod_LLM.git ."
echo "2. Setup env: cp apps/api/env.production.example apps/api/.env"
echo "3. Edit .env with real values"
echo "4. Install deps: cd apps/api && npm install"
echo "5. Generate Prisma: npx prisma generate && npx prisma db push"
echo "6. Seed data: npm run seed"
echo "7. Build: npm run build"
echo "8. Start: pm2 start dist/main.js --name llm-api"
echo "9. Configure Nginx reverse proxy"
