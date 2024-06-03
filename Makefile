dev:
	npm run start

deploy:
	npm run build
	ansible-playbook -i deployment/inventory deployment/myaws.yml