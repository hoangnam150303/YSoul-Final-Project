# Sử dụng Nginx image nhẹ
FROM nginx:alpine

# Xóa file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy các file frontend đã build vào thư mục phục vụ của Nginx
COPY dist/ /usr/share/nginx/html

# Copy file cấu hình tùy chọn (nếu có)
# COPY nginx.conf /etc/nginx/nginx.conf

# Mặc định Nginx chạy trên cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
