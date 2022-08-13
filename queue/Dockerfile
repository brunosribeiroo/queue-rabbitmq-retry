FROM --platform=amd64 rabbitmq:3.9-management-alpine

# total_memory_available_override_value = 768m \
RUN echo -e "\
\ntotal_memory_available_override_value = 805306368 \
\nloopback_users.guest = false \
\nlisteners.tcp.default = 5672 \
\ndefault_pass = rabbitmq \
\ndefault_user = rabbitmq \
\nmanagement.tcp.port = 15672 \
\ncollect_statistics_interval = 60000 \
\nheartbeat = 180 \
\nlog.file.level = debug \
" >> /etc/rabbitmq/rabbitmq.conf
