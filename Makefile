mongo:
	@docker pull mongo:8.0.4 
	@docker rm -f coder-backend-entrega
	@docker run --env-file .env.mongo --name coder-backend-entrega -v ./volumes/db:/data/db -v ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro -p27017:27017 -d mongo:8.0.4 
mongosh:
	@docker exec -it coder-backend-entrega mongosh

run:
	@make mongo 
	@npm run dev