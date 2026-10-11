FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY index.html privacy-policy.html script.js style.css /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/