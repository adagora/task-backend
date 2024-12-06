rm -fr ./build

if [ ! -f .env ]; then
    # Copy contents of .env.example to .env
    cp .env.example .env
    echo "Copied .env.example to .env"
fi

docker-compose up -d

npm install

npm run typeorm migration:run

npm run start:dev
