FROM nginx:alpine

# Remove default nginx config and replace with ours
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static site files into the nginx serve directory
COPY . /usr/share/nginx/html

EXPOSE 80